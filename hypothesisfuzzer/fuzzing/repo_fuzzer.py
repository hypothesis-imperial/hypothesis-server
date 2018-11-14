import json
import logging
import os
import shutil
import subprocess
import threading
import virtualenv

from flask import jsonify
from git import Repo as GitRepo
from ..errors import (
    no_code_dir_error,
    generic_error
)


class RepoFuzzer:

    def __init__(self, name, config):

        self.log = logging.getLogger('logger')
        self.log.debug('Initialising repository %s fuzzer.', name)

        self.name = name
        self.config = config
        self._clone_git(config['git_url'])
        self._create_venv()
        self._start_fuzzing()

        self.log.debug('Repository %s fuzzer initialised.', name)

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

    def get_commit_hash(self):

        if not os.path.exists(self.name):
            return no_code_dir_error()
        repo = GitRepo(self.name)
        sha = repo.head.object.hexsha

        return jsonify({
            "sha": sha
        })

    def get_errors(self):
        if not os.path.exists(self.name):
            return no_code_dir_error()
        with open(self.name+'/data.txt', 'r') as file_data:
            return jsonify(json.load(file_data))

    def _clone_git(self, git_url):

        self.log.debug('Cloneing repository %s.', self.name)

        # Delete old code folder - might want to do git pull instead
        if os.path.exists(self.name):
            self.log.debug('Deleting old repository %s.', self.name)
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
            self.log.debug('Stopping fuzzing for repository %s.', self.name)
            self._current_fuzzing_task.running = False
            self._current_fuzzing_task.join()
            self.log.debug('Fuzzing for repository %s stopped.', self.name)

    def _start_fuzzing(self):

        os.chdir(self.name)
        assert os.path.basename(os.getcwd()) == self.name
        self._current_fuzzing_task = \
            threading.Thread(target=self._fuzz_task,
                             args=())
        self._current_fuzzing_task.start()
        os.chdir('..')

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
