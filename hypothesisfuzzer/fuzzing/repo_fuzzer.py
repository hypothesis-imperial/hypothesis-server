import os
import json
import shutil
import virtualenv
import subprocess
import threading

from flask import jsonify
from git import Repo as GitRepo
from ..errors import (
    no_code_dir_error,
    generic_error
)


class RepoFuzzer:

    def __init__(self, name, config):
        self.name = name
        self.config = config
        self._clone_git(config['git_url'])
        self._create_venv()
        self._start_fuzzing()

    def on_webhook(self, payload):
        # Check if repo is the same name as the one set in config
        try:
            if payload["repository"]["name"] != self.config['repo_name']:
                return 'OK'
        except KeyError:
            pass

        try:
            self._clone_git(self.config['git_url'])
        except Exception:
            return generic_error(msg="Error cloning Git Repo! " +
                                     "Please ensure you have access.")

        self._stop_fuzzing()
        self._create_venv()
        self._start_fuzzing()

        return 'OK'

    def get_commit_hash():

        if not os.path.exists("code"):
            return no_code_dir_error()
        repo = GitRepo("code")
        sha = repo.head.object.hexsha

        return jsonify({
            "sha": sha
        })

    def get_errors():
        if not os.path.exists("code"):
            return no_code_dir_error()
        with open('data.txt', 'r') as file_data:
            return jsonify(json.load(file_data))

    def _clone_git(self, git_url):
        # Delete old code folder

        if os.path.exists(self.name):
            shutil.rmtree(self.name, ignore_errors=True)

        os.makedirs(self.name)
        GitRepo.clone_from(git_url, self.name)

    def _create_venv(self):

        os.chdir(self.name)
        assert os.path.basename(os.getcwd()) == self.name

        virtualenv.create_environment('venv')
        subprocess.run(['venv/bin/pip',
                        'install', '-r', 'requirements.txt'])
        os.chdir('..')

    def _stop_fuzzing(self):
        if self._current_fuzzing_task:
            self._current_fuzzing_task.running = False
            self._current_fuzzing_task.join()

    def _start_fuzzing(self):

        os.chdir(self.name)
        assert os.path.basename(os.getcwd()) == self.name
        self._current_fuzzing_task = \
            threading.Thread(target=self._fuzz_task,
                             args=())
        self._current_fuzzing_task.start()
        os.chdir("..")

    def _fuzz_task(self):

        assert os.path.basename(os.getcwd()) == self.name

        iteration = 0

        while getattr(self._current_fuzzing_task, "running", True):
            subprocess.run(['venv/bin/pytest'],
                           universal_newlines=True,
                           stdout=subprocess.PIPE)
            print('Fuzzing iteration: ', iteration)
            iteration += 1
        print('Fuzzing stopped after', iteration, 'iterations')
