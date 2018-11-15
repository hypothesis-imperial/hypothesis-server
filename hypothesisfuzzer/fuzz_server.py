import json
import logging
import logging.handlers
import os
import yaml

from .errors import ConfigMissingOptionException
from .fuzzing import RepoFuzzer
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request, send_from_directory
from sys import platform


logging.basicConfig(datefmt='%d-%b-%y %H:%M:%S',
                    filename='fuzz_server.log',
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    level=logging.DEBUG)

if platform.startswith('linux'):
    handler = logging.handlers.SysLogHandler(address='/dev/log')
    logging.getLogger('logger').addHandler(handler)

logger = logging.getLogger(__name__)


class FuzzServer:

    def __init__(self, config_path='config.yml'):

        logger.debug('Initialising fuzzing server.')

        self.app = Flask(__name__, static_url_path='/build')
        CORS(self.app)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = \
            os.environ.get('DATABASE_URL', 'sqlite:///data.db')
        self.app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

        self._load_config(config_path)
        self.db = SQLAlchemy(self.app)
        self.current_fuzzing_task = None

        for name, repo_config in self.config['repos'].items():
            self.fuzzer = RepoFuzzer(name, repo_config)

        logger.debug('Fuzzing server initialised.')

    def run(self, **kwargs):

        logger.debug('Fuzzing server started running.')

        self.db.create_all()
        self._setup_routes()

        self.app.run(**kwargs)

        logger.debug('Fuzzing server stopped running.')

    def _setup_routes(self):

        logger.debug('Setting up routes.')

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():
            logger.debug('Git push for repository %s occurred.',
                          self.fuzzer.name)
            return self.fuzzer.on_webhook(json.loads(request.data))

        @self.app.route('/get_commit_hash', methods=['GET'])
        def get_commit_hash():
            return self.fuzzer.get_commit_hash()

        @self.app.route('/', methods=['GET'])
        def home():
            return send_from_directory('build', 'index.html')

        @self.app.route('/<path:path>', methods=['GET'])
        def serve_static(path):
            return send_from_directory('build', path)

        @self.app.route('/get_errors', methods=['GET'])
        def get_errors():
            return self.fuzzer.get_errors()

        logger.debug('Routes set up.')

    def _load_config(self, config_path):

        logger.debug('Loading configurations.')

        try:
            with open(config_path) as file:
                logger.info('Opening file config_path.')
                self.config = yaml.load(file)

                if 'repos' not in self.config:
                    logger.error('Configuration file missing repos.',
                                   exc_info=True)
                    raise \
                        ConfigMissingOptionException("Configuration file" +
                                                     "missing a 'repos'" +
                                                     "attribute")
                logger.info('File config_path loaded.', exc_info=True)
        except FileNotFoundError:
            logger.error('File config.yml not found.', exc_info=True)
            raise FileNotFoundError('config.yml file not found. ' +
                                    'Create one or specify config path.')

        logger.debug('Configurations loaded.')
