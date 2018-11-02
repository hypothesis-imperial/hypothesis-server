from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os
import subprocess
import shutil
import virtualenv
import threading
import yaml
from git import Repo
from flask_sqlalchemy import SQLAlchemy
from .exceptions import ConfigMissingOptionException


class Fuzzer:

    def __init__(self, config_path='config.yml'):
        self._load_config(config_path)
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = \
            os.environ.get('DATABASE_URL', 'sqlite:///data.db')
        self.app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
        self.db = SQLAlchemy(self.app)
        self.current_fuzzing_task = None
        self.failing_tests = [  # Dummy failures for now
            {"error": "x = 1042"},
            {"error": "x = 1322"}
        ]
        self.clone_code()
        self.current_fuzzing_task = threading.Thread(target=self._fuzz,
                                                     args=())
        self.current_fuzzing_task.start()

    def clone_code(self):
        if os.path.exists("code"):
            shutil.rmtree("code", ignore_errors=True)
        os.makedirs("code")

        Repo.clone_from(self.config["git_url"], "code")

        os.chdir("code")
        virtualenv.create_environment('venv')
        subprocess.run(['venv/bin/pip',
                        'install', '-r', 'requirements.txt'])
        os.chdir("..")

    def _fuzz(self):
        os.chdir("code")

        while getattr(self.current_fuzzing_task, "running", True):
            subprocess.run(['pytest'],
                           universal_newlines=True,
                           stdout=subprocess.PIPE)
            print('Did one iteration!')
        print('Stopped now')

    def run(self, **kwargs):
        self.db.create_all()

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():

            data = json.loads(request.data)

            # Check if repo is the same name as the one set in config
            try:
                if data["repository"]["name"] != self.config['repo_name']:
                    return
            except KeyError:
                pass

            if data["repository"]["private"] == "true":
                return private_repo_error()
            self.clone_code()
            os.chdir("code")
            virtualenv.create_environment('venv')
            subprocess.run(['venv/bin/pip',
                            'install', '-r', 'requirements.txt'])

            if self.current_fuzzing_task:
                self.current_fuzzing_task.running = False
                self.current_fuzzing_task.join()

            self.current_fuzzing_task = threading.Thread(target=self._fuzz,
                                                         args=())
            self.current_fuzzing_task.start()
            os.chdir("..")

            return 'OK'

        @self.app.route('/dashboard', methods=['GET'])
        def dashboard():
            with self.app.app_context():
                rendered = render_template('dashboard.template',
                                           title="Dashboard",
                                           errors=self.failing_tests)

            return rendered

        @self.app.route('/get_commit_hash', methods=['GET'])
        def get_commit_hash():
            if not os.path.exists("code"):
                return no_code_dir_error()
            repo = Repo("code")
            sha = repo.head.object.hexsha

            return jsonify({
                "sha": sha
            })

        @self.app.route('/get_errors', methods=['GET'])
        def get_errors():
            if not os.path.exists("code"):
                return no_code_dir_error()
            with open('data.txt', 'r') as file_data:
                return jsonify(json.load(file_data))

        @self.app.errorhandler(500)
        def private_repo_error():
            msg = "Cannot access a private repository." +\
                    " Make public, or add SSH keys, and try again."

            return jsonify(error=500, text=str(msg)), 500

        @self.app.errorhandler(500)
        def no_code_dir_error():
            msg = "No git repository has been cloned yet." + \
                    " Please push code and/or configure your webhooks."

            return jsonify(error=500, text=str(msg)), 500
        self.app.run(**kwargs)

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


"""
SAMPLE CODE FOR A TABLE
"""
# class UserModel(db.Model):
#     __tablename__ = 'users'

#     uid = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80))
#     password = db.Column(db.String(80))
