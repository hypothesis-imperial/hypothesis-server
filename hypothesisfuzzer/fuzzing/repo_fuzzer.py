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

        self.log.debug('Webhook event began.')

        # Check if repo is the same name as the one set in config
        payload_name = payload["repository"]["name"]
        config_name = self.config['repo_name']
        try:
            if payload_name != config_name:
                self.log.warning('Repository %s is different from %s.',
                                 payload_name,
                                 config_name)
                return 'OK'
        except KeyError:
            self.log.info('Repository %s is as configured.', payload_name)
            pass

        try:
            self.log.debug('Cloning repository %s.', payload_name)
            self._clone_git(self.config['git_url'])
            self.log.debug('Repository %s cloned.', payload_name)
        except Exception:
            self.log.error('Unable to access repository %s for cloning.',
                           payload_name)
            return generic_error(msg="Error cloning Git repository! " +
                                     "Please ensure you have access.")

        self._stop_fuzzing()
        self.log.debug('Old repository fuzzing stopped.')
        self._create_venv()
        self.log.debug('Virtual environment created and fuzzing restarted.')
        self._start_fuzzing()

        self.log.debug('Webhook event ended.')

        return 'OK'

    def get_commit_hash(self):

        self.log.debug('Getting commit hash for repository %s.', self.name)

        if not os.path.exists(self.name):
            self.log.error('When getting commit hash, path of %s not found.',
                           self.name)
            return no_code_dir_error()
        repo = GitRepo(self.name)
        sha = repo.head.object.hexsha

        self.log.debug('Commit hash for repository %s obtained.', self.name)

        return jsonify({
            "sha": sha
        })

    def get_errors(self):

        self.log.debug('Getting errors for repository %s.', self.name)

        if not os.path.exists(self.name):
            self.log.error('When getting errors, path of %s not found.',
                           self.name)
            return no_code_dir_error()
        with open(self.name+'/data.txt', 'r') as file_data:
            self.log.debug('Errors for repository %s obtained.', self.name)
            return jsonify(json.load(file_data))

    def _clone_git(self, git_url):

        self.log.debug('Cloning repository %s.', self.name)

        # Delete old code folder - might want to do git pull instead
        if os.path.exists(self.name):
            self.log.debug('Deleting old repository %s.', self.name)
            shutil.rmtree(self.name, ignore_errors=True)
            self.log.debug('Old repository %s deleted.', self.name)

        os.makedirs(self.name)
        GitRepo.clone_from(git_url, self.name)

        self.log.debug('Repository %s cloned.', self.name)

    def _create_venv(self):

        self.log.debug('Creating virtual environment for repository %s.',
                       self.name)

        os.chdir(self.name)
        assert os.path.basename(os.getcwd()) == self.name
        virtualenv.create_environment('venv')
        subprocess.run(['venv/bin/pip',
                        'install', '-r', 'requirements.txt'])
        os.chdiry("..")

        self.log.debug('Virtual environment for repository %s created.',
                       self.name)

    def _stop_fuzzing(self):

        self.log.debug('Stopping fuzzing for repository %s.', self.name)

        if self._current_fuzzing_task:
            self.log.debug('Stopping fuzzing for repository %s.', self.name)
            self._current_fuzzing_task.running = False
            self._current_fuzzing_task.join()
            self.log.debug('Fuzzing for repository %s stopped.', self.name)

        self.log.debug('Fuzzing for repository %s stopped.', self.name)

    def _start_fuzzing(self):

        self.log.debug('Starting fuzzing for repository %s.', self.name)

        os.chdir(self.name)
        assert os.path.basename(os.getcwd()) == self.name
        self._current_fuzzing_task = \
            threading.Thread(target=self._fuzz_task,
                             args=())
        self._current_fuzzing_task.start()
        os.chdir('..')

        self.log.debug('Fuzzing for repository %s started.', self.name)

    def _fuzz_task(self):

        self.log.debug('Fuzzing task of repository %s.', self.name)

        assert os.path.basename(os.getcwd()) == self.name

        iteration = 0

        while getattr(self._current_fuzzing_task, "running", True):
            self.log.info('Fuzzing iteration %s.', iteration)
            subprocess.run(['venv/bin/pytest'],
                           universal_newlines=True,
                           stdout=subprocess.PIPE)
            print('Fuzzing iteration: ', iteration)
            iteration += 1
        print('Fuzzing stopped after', iteration, 'iterations')

        self.log.debug('Task of repository %s fuzzed.', self.name)
