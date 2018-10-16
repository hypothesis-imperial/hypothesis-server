from flask import Flask, request, jsonify
import json
import os
import subprocess
import shutil
from git import Repo


application = Flask(__name__)
app = application


@app.route('/')
def hello():
    return "Hello World!"


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
    os.chdir("code")
    output = subprocess.run(['pytest', '-m', 'hypothesis', "--hypothesis-show-statistics"], universal_newlines=True, stdout=subprocess.PIPE)
    os.chdir("..")
    f = open("results.txt", "w+")
    f.write(output.stdout)
    f.close()
    return 'OK'


@app.route('/get_commit_hash', methods=['GET'])
def get_commit_hash():
    repo = Repo("code")
    sha = repo.head.object.hexsha
    return jsonify({
            "sha": sha
            })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)
