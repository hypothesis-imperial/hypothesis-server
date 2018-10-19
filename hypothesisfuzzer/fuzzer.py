from flask import Flask, request, jsonify
import json
import os
from git import Repo
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = \
    os.environ.get('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
db = SQLAlchemy(app)


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


"""
SAMPLE CODE FOR A TABLE
"""
# class UserModel(db.Model):
#     __tablename__ = 'users'

#     uid = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80))
#     password = db.Column(db.String(80))


class Fuzzer:

    def __init__(self):
        self.app = app

    def run(self, **kwargs):
        self.app.run(**kwargs)
        db.create_all()


"""
FOR TESTING PURPOSE
"""
# Fuzzer().run(port=5000)
