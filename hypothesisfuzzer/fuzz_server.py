import json
import os
import yaml

from .fuzzing import RepoFuzzer
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
        self._init_fuzzers()
        self.db = SQLAlchemy(self.app)

    def run(self, **kwargs):

        self.db.create_all()
        self._setup_routes()

        self.app.run(**kwargs)

    def _setup_routes(self):

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():
            data = json.loads(request.data)
            name = data['repository']['name']
            owner = data['repository']['owner']['name']

            try:
                fuzzer = self.fuzzers[(name, owner)]

                return fuzzer.on_webhook(data)

            except KeyError:
                return 'Not OK', 404

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

                return fuzzer.get_errors()

            except KeyError:
                return 'Not OK', 404

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
            raise FileNotFoundError('config.yml file not found. ' +
                                    'Create one or specify config path.')

    def _init_fuzzers(self):
        self.fuzzers = {}

        for repo, repo_config in self.config['repos'].items():

            repo_name = repo_config['name']
            repo_owner = repo_config['owner']

            self.fuzzers[(repo_name, repo_owner)] = \
                RepoFuzzer(repo, repo_config)
