import os
import json
import shutil
import virtualenv
import subprocess
import threading
import datetime

from git import Repo as GitRepo
from ..errors import (
    no_code_dir_error,
    generic_error,
    ConfigMissingOptionException,
    WrongDirectoryException
)


class RepoFuzzer:

    def __init__(self, name, config):
        self.name = name
        self._load_config(config)
        self._clone_git(config['git_url'])
        self._create_venv()

    def start(self):
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

    def get_commit_hash(self):

        if not os.path.exists(self.name):
            return no_code_dir_error()
        repo = GitRepo(self.name)
        sha = repo.head.object.hexsha

        return {
            "sha": sha
        }

    def get_errors(self):
        if not os.path.exists(self.name):
            return no_code_dir_error()
        with open(self.name+'/data.txt', 'r') as file_data:
            return json.load(file_data)

    def _clone_git(self, git_url):

        if os.path.exists(self.name):
            shutil.rmtree(self.name, ignore_errors=True)

        os.makedirs(self.name)
        GitRepo.clone_from(git_url, self.name)

    def _create_venv(self):

        virtualenv.create_environment(self.name + '/venv')
        subprocess.call([self.name + '/venv/bin/pip',
                        'install', '-r', self.name + '/requirements.txt'])

    def _stop_fuzzing(self):
        if self._current_fuzzing_task:
            self._current_fuzzing_task.running = False
            self._current_fuzzing_task.join()

    def _start_fuzzing(self):

        self._fuzz_start_time = datetime.datetime.now()
        self._current_fuzzing_task = \
            threading.Thread(target=self._fuzz_task,
                             args=())
        self._current_fuzzing_task.start()

    def _fuzz_task(self):

        iteration = 0

        while getattr(self._current_fuzzing_task, "running", True):
            subprocess.call([self.name + '/venv/bin/pytest', self.name],
                            universal_newlines=True,
                            stdout=subprocess.PIPE)
            print('Fuzzing iteration: ', iteration)
            iteration += 1
        print('Fuzzing stopped after', iteration, 'iterations')

    def _load_config(self, config):
        if 'name' not in config:
            raise \
                ConfigMissingOptionException("Repo configuration" +
                                             "missing a 'name'" +
                                             "attribute")

        if 'owner' not in config:
            raise \
                ConfigMissingOptionException("Repo configuration" +
                                             "missing a 'owner'" +
                                             "attribute")

        self.config = config

    def _check_dir(self):
        if os.path.basename(os.getcwd()) != self.name:
            raise WrongDirectoryException(os.path.basename(os.getcwd()),
                                          self.name)
