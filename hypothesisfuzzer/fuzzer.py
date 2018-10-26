from flask import Flask, request, jsonify
import json
import os
import subprocess
import shutil
import threading
from git import Repo
from flask_sqlalchemy import SQLAlchemy
from flask import render_template


class Fuzzer:

    def __init__(self):
        self.app = Flask(__name__)
        self.app.config['SQLALCHEMY_DATABASE_URI'] = \
            os.environ.get('DATABASE_URL', 'sqlite:///data.db')
        self.app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
        self.db = SQLAlchemy(self.app)
        self.current_fuzzing_task = None
        self.failing_tests = [
            {"error": "x = 1042"},
            {"error": "x = 1322"}
        ]

    def run(self, **kwargs):
        self.db.create_all()

        @self.app.route('/webhook', methods=['POST'])
        def on_git_push():

            if self.current_fuzzing_task:
                self.current_fuzzing_task.running = False
                self.current_fuzzing_task.join()

            if os.path.exists("code"):
                shutil.rmtree("code", ignore_errors=True)

            if os.path.isfile("results.txt"):
                os.remove("results.txt")

            os.makedirs("code")
            data = json.loads(request.data)
            url = data["repository"]["html_url"]
            Repo.clone_from(url, "code")
            os.chdir("code")

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
            app = Flask('dashboard')
            with app.app_context():
                rendered = render_template('dashboard.html',
                                           title="Dashboard",
                                           errors=self.failing_tests)
                f = open("dashboard.html", "w")
                f.write(rendered)
                f.close()

            return rendered
            # return self.app.send_static_file('dashboard.html')

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

        @self.app.route('/get_commit_hash', methods=['GET'])
        def get_commit_hash():
            repo = Repo("code")
            sha = repo.head.object.hexsha

            return jsonify({
                "sha": sha
            })

        self.app.run(**kwargs)


fuzzer = Fuzzer()
fuzzer.run(host='0.0.0.0', port=8080)

"""
SAMPLE CODE FOR A TABLE
"""
# class UserModel(db.Model):
#     __tablename__ = 'users'

#     uid = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80))
#     password = db.Column(db.String(80))
