import json
import os
import yaml

from fuzzer import RepoFuzzer
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import Flask, request, send_from_directory
from .errors import (
    ConfigMissingOptionException,
)


class FuzzServer:

    def __init__(self, config_path='config.yml'):

        self.app = Flask(__name__, static_url_path='/build')
        CORS(self.app)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = \
            os.environ.get('DATABASE_URL', 'sqlite:///data.db')
        self.app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

        self._load_config(config_path)
        self.db = SQLAlchemy(self.app)
        self.current_fuzzing_task = None
        self.fuzzer = RepoFuzzer(self.config)

    def run(self, **kwargs):

        self.db.create_all()
        self._setup_routes()

        self.app.run(**kwargs)

    def _setup_routes(self):

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():
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

    def _load_config(self, config_path):
        try:
            with open(config_path) as file:
                self.config = yaml.load(file)

                if 'git_url' not in self.config:
                    raise \
                        ConfigMissingOptionException("Configuration file" +
                                                     "missing a 'git_url'" +
                                                     "value")

                if 'branch' not in self.config:
                    raise \
                        ConfigMissingOptionException("Configuration file" +
                                                     "missing a 'branch'" +
                                                     "value")
        except FileNotFoundError:
            raise FileNotFoundError('config.yml file not found. ' +
                                    'Create one or specify config path.')
