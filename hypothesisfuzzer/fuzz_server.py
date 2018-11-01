import json
import os
import subprocess
import shutil
import threading
import yaml

from fuzzer import Fuzzer
from git import Repo
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, render_template
from .exceptions import ConfigMissingOptionException


class FuzzServer:

    def __init__(self, config_path='config.yml'):
        self._load_config(config_path)
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = \
            os.environ.get('DATABASE_URL', 'sqlite:///data.db')
        self.app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
        self.fuzzer = Fuzzer()
        self.db = SQLAlchemy(self.app)
        self.current_fuzzing_task = None
        self.failing_tests = [  # Dummy failures for now
            {"error": "x = 1042"},
            {"error": "x = 1322"}
        ]

    def run(self, **kwargs):
        self.db.create_all()
        self._setup_routes()

        self.app.run(**kwargs)

    def _setup_routes(self):

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():

            data = json.loads(request.data)

            # Check if repo is the same name as the one set in config
            try:
                if data["repository"]["name"] != self.config['repo_name']:
                    return
            except KeyError:
                pass

            if os.path.exists("code"):
                shutil.rmtree("code", ignore_errors=True)

            if os.path.isfile("results.txt"):
                os.remove("results.txt")

            os.makedirs("code")

            if data["repository"]["private"] == "true":
                return private_repo_error()
            url = data["repository"]["html_url"]
            Repo.clone_from(url, "code")
            os.chdir("code")

            if self.current_fuzzing_task:
                self.current_fuzzing_task.running = False
                self.current_fuzzing_task.join()

            def fuzz():
                def write_to_results(output):
                    os.chdir("..")
                    f = open("results.txt", "a")
                    f.write(output.stdout)
                    f.close()
                    os.chdir("code")

                while getattr(self.current_fuzzing_task, "running", True):
                    output = subprocess.run(['pytest', '-m', 'hypothesis',
                                            "--hypothesis-show-statistics"],
                                            universal_newlines=True,
                                            stdout=subprocess.PIPE)
                    write_to_results(output)
                    print('Did one iteration!')
                print('Stopped now')

            self.current_fuzzing_task = threading.Thread(target=fuzz, args=())
            self.current_fuzzing_task.start()

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
