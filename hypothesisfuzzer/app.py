from flask import Flask, request, jsonify
import json
import os
from git import Repo



class Fuzzer:
    def __init__():
        application = Flask(__name__)
        app = application

    @app.route('/')
    def hello():
        return "Hello World!"


    @app.route('/webhook', methods=['POST'])
    def on_git_push():
        if os.path.exists("code"):
            os.rmdir("code")
        os.makedirs("code")
        data = json.loads(request.data)
        url = data["repository"]["html_url"]
        Repo.clone_from(url, "code")

        return 'OK'


    @app.route('/get_commit_hash', methods=['GET'])
    def get_commit_hash():
        repo = Repo("code")
        sha = repo.head.object.hexsha

        return jsonify({
                "sha": sha
                })
    def run(**kwargs):
        app.run(**kwargs)


