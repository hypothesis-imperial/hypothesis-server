from flask import Flask, request, jsonify
import json
import os
import subprocess
import shutil
import threading
from git import Repo

app = Flask(__name__)

current_fuzzing_task = None


@app.route('/webhook', methods=['POST'])
def on_git_push():
    if os.path.exists("code"):
        shutil.rmtree("code", ignore_errors=True)

    if os.path.isfile("results.txt"):
        os.remove("results.txt")
    os.makedirs("code")
    data = json.loads(request.data)
    url = data["repository"]["html_url"]
    Repo.clone_from(url, "code")

    current_fuzzing_task = AsyncFuzzingTask()
    current_fuzzing_task.start()

    return 'OK'


@app.route('/get_commit_hash', methods=['GET'])
def get_commit_hash():
    repo = Repo("code")
    sha = repo.head.object.hexsha

    return jsonify({
            "sha": sha
            })


class Fuzzer:

    def __init__(self):
        self.app = app

    def run(self, **kwargs):
        self.app.run(**kwargs)


class AsyncFuzzingTask(threading.Thread):

    def __init__(self):
        super(AsyncFuzzingTask, self).__init__()
        pass

    def run(self):
        def write_to_results(output):
            f = open("results.txt", "a")
            f.write(output.stdout)
            f.close()

        for i in range(10):
            output = subprocess.run(['pytest', '-m', 'hypothesis',
                                    "--hypothesis-show-statistics"],
                                    universal_newlines=True,
                                    stdout=subprocess.PIPE)
            write_to_results(output)
            print('Did one iteration!')
