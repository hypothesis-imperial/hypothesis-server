import json
import logging
import os
import yaml

from .fuzzing import RepoFuzzer
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request, send_from_directory
from .errors import (
    ConfigMissingOptionException,
)


logging.basicConfig(datefmt='%d-%b-%y %H:%M:%S',
                    filename='fuzz_server.log',
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    level=logging.DEBUG)


class FuzzServer:

    def __init__(self, config_path='config.yml'):

        self.log = logging.getLogger('logger')
        self.log.debug('Initialising fuzzing server.')

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

    def run(self, **kwargs):

        self.db.create_all()
        self._setup_routes()

        self.app.run(**kwargs)

    def _setup_routes(self):

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():
            self.log.info('Git push for repository %s occurred.',
                          self.fuzzer.name)
            return self.fuzzer.on_webhook(json.loads(request.data))

        @self.app.route('/get_commit_hash', methods=['GET'])
        def get_commit_hash():
            self.log.debug('Getting commit hash.')
            return self.fuzzer.get_commit_hash()

        @self.app.route('/', methods=['GET'])
        def home():
            return send_from_directory('build', 'index.html')

        @self.app.route('/<path:path>', methods=['GET'])
        def serve_static(path):
            return send_from_directory('build', path)

        @self.app.route('/get_errors', methods=['GET'])
        def get_errors():
            self.log.debug('Getting errors.')
            return self.fuzzer.get_errors()

    def _load_config(self, config_path):
        try:
            with open(config_path) as file:
                self.config = yaml.load(file)

                if 'repos' not in self.config:
                    raise \
                        ConfigMissingOptionException("Configuration file" +
                                                     "missing a 'repos'" +
                                                     "attribute")
        except FileNotFoundError:
            self.log.debug('File config.yml not found.', exc_info=True)
            raise FileNotFoundError('config.yml file not found. ' +
                                    'Create one or specify config path.')
