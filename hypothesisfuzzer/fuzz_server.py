import json
import logging
import logging.handlers
import os
import yaml

from .errors import ConfigMissingOptionException
from .fuzzing import RepoFuzzer
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request, send_from_directory, jsonify
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
        self._init_fuzzers()
        self.db = SQLAlchemy(self.app)

        logger.info('Fuzzing server initialised.')

    def run(self, **kwargs):

        logger.info('Fuzzing server started running.')

        self.db.create_all()
        self._setup_routes()

        for (name, owner), fuzzer in self.fuzzers.items():
            fuzzer.start()

        self.app.run(**kwargs)

        logger.debug('Fuzzing server stopped running.')

    def _setup_routes(self):

        logger.info('Setting up routes.')

        @self.app.route('/all_info', methods=['GET'])
        def get_data():
            repositories = []

            for (name, owner), fuzzer in self.fuzzers.items():
                with open(name + '.json') as f:
                    data = json.load(f)
                    data["repo_name"] = name
                    repositories.append(data)

            return jsonify({
                "repositories": repositories
            })

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():
            logger.debug('Git push for repository %s occurred.',
                         self.fuzzer.name)
            data = json.loads(request.data)
            name = data['repository']['name']
            owner = data['repository']['owner']['name']

            try:
                fuzzer = self.fuzzers[(name, owner)]

                return fuzzer.on_webhook(data)
            except KeyError:
                logger.error('Server not configured to fuzz this repository.',
                             exc_info=True)
                err_message = (
                    'Hypothesis server has not been configured to'
                    'fuzz this repository.'
                )

                return err_message, 404

        @self.app.route('/', methods=['GET'])
        def home():
            return send_from_directory('build', 'index.html')

        @self.app.route('/<path:path>', methods=['GET'])
        def serve_static(path):
            return send_from_directory('build', path)

        @self.app.route('/get_errors', methods=['POST'])
        def get_errors():
            data = json.loads(request.data)
            name = data['name']
            owner = data['owner']
            try:
                fuzzer = self.fuzzers[(name, owner)]

                return jsonify(fuzzer.get_errors())
            except KeyError:
                logger.error('Server not configured to fuzz this repository.')
                err_message = (
                    'Hypothesis server has not been configured to'
                    'fuzz this repository.'
                )

                return err_message, 404

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
                    raise ConfigMissingOptionException("Configuration file" +
                                                       "missing a 'repos'" +
                                                       "attribute")
                logger.info('File config_path loaded.', exc_info=True)
        except FileNotFoundError:
            logger.error('File config.yml not found.', exc_info=True)
            raise FileNotFoundError('config.yml file not found. ' +
                                    'Create one or specify config path.')

        logger.info('Server Configuration loaded.')

    def _init_fuzzers(self):

        logger.debug('Initialising fuzzers.')

        self.fuzzers = {}

        for repo, repo_config in self.config['repos'].items():

            repo_name = repo_config['name']
            repo_owner = repo_config['owner']

            self.fuzzers[(repo_name, repo_owner)] = RepoFuzzer(repo_name,
                                                               repo_config)

        logger.info('Fuzzers initialised.')


logging.shutdown()
