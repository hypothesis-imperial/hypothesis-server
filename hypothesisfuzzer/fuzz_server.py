import json
import os
import yaml
import logging

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

        logging.info('Fuzz server initialising.')

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

        logging.info('Fuzz server initialised.')

    def run(self, **kwargs):

        logging.info('Fuzz server started running.')

        self.db.create_all()
        self._setup_routes()

        self.app.run(**kwargs)

        logging.info('Fuzz server stopped running.')

    def _setup_routes(self):

        logging.info('Fuzz server started setting up routes')

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():
            logging.info('Fuzz server _setup_routes(): on_git_push()')
            return self.fuzzer.on_webhook(json.loads(request.data))

        @self.app.route('/get_commit_hash', methods=['GET'])
        def get_commit_hash():
            logging.info('Fuzz server _setup_routes(): get_commit_hash()')
            return self.fuzzer.get_commit_hash()

        @self.app.route('/', methods=['GET'])
        def home():
            logging.info('Fuzz server _setup_routes(): home()')
            return send_from_directory('build', 'index.html')

        @self.app.route('/<path:path>', methods=['GET'])
        def serve_static(path):
            logging.info('Fuzz server _setup_routes(): serve_static()')
            return send_from_directory('build', path)

        @self.app.route('/get_errors', methods=['GET'])
        def get_errors():
            logging.info('Fuzz server _setup_routes(): get_errors()')
            return self.fuzzer.get_errors()

        logging.info('Fuzz server stopped setting up routes')

    def _load_config(self, config_path):

        logging.info('Fuzz server started loading configurations')

        try:
            logging.info('Fuzz server _load_config(): file open')
            with open(config_path) as file:
                self.config = yaml.load(file)

                if 'repos' not in self.config:
                    logging.error('Fuzz server _load_config(): ' +
                                  'Configuration file missing' +
                                  'a repos attribute.', exc_info=True)
                    raise \
                        ConfigMissingOptionException("Configuration file" +
                                                     "missing a 'repos'" +
                                                     "attribute")
        except FileNotFoundError:
            logging.error('Fuzz server _load_config(): ' +
                          'config.yml file not found.', exc_info=True)
            raise FileNotFoundError('config.yml file not found. ' +
                                    'Create one or specify config path.')
