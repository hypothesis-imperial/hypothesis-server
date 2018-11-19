import datetime
import json
import logging
import os
import shutil
import subprocess
import threading
import virtualenv

from git import Repo as GitRepo
from ..errors import (
    no_code_dir_error,
    generic_error,
    ConfigMissingOptionException,
    WrongDirectoryException
)


logger = logging.getLogger(__name__)


class RepoFuzzer:

    def __init__(self, name, config):

        logger.debug('Initialising repository %s fuzzer.', name)

        self.name = name
        self._load_config(config)
        self._clone_git(config['git_url'])
        self._create_venv()

        logger.info('Repository %s fuzzer initialised.', name)

    def start(self):

        logger.debug('Starting fuzzing for repository %s.', self.name)

        self._start_fuzzing()

        logger.debug('Fuzzing for repository %s started.', self.name)

    def on_webhook(self, payload):

        logger.debug('Webhook event triggered')

        # Check if repo is the same name as the one set in config
        payload_name = payload["repository"]["name"]
        config_name = self.config['repo_name']
        try:
            if payload_name != config_name:
                logger.warning('Repository %s is different from %s.',
                               payload_name, config_name)

                return 'OK'
        except KeyError:
            logger.info('Repository %s is as configured.', payload_name)
            pass

        try:
            logger.debug('Cloning repository %s.', payload_name)
            self._clone_git(self.config['git_url'])
            logger.debug('Repository %s cloned.', payload_name)
        except Exception:
            logger.error('Unable to access repository %s for cloning.',
                         payload_name)

            return generic_error(msg="Error cloning Git repository! " +
                                     "Please ensure you have access.")

        self._stop_fuzzing()
        logger.debug('Old repository fuzzing stopped.')
        self._create_venv()
        logger.debug('Virtual environment created and fuzzing restarted.')
        self._start_fuzzing()

        return 'OK'

    def get_commit_hash(self):

        logger.debug('Getting commit hash for repository %s.', self.name)

        if not os.path.exists(self.name):
            logger.error('When getting commit hash, path of %s not found.',
                         self.name)

            return no_code_dir_error()
        repo = GitRepo(self.name)
        sha = repo.head.object.hexsha

        logger.debug('Commit hash for repository %s obtained.', self.name)

        return {
            "sha": sha
        }

    def get_errors(self):

        logger.debug('Getting errors for repository %s.', self.name)

        if not os.path.exists(self.name):
            logger.error('When getting errors, path of %s not found.',
                         self.name)

            return no_code_dir_error()

        with open(self.name + '.json', 'r') as file_data:
            logger.debug('Errors for repository %s obtained.', self.name)

            return json.load(file_data)

    def _clone_git(self, git_url):

        logger.debug('Cloning repository %s.', self.name)

        # Delete old code folder - might want to do git pull instead

        if os.path.exists(self.name):
            logger.debug('Deleting old repository %s.', self.name)
            shutil.rmtree(self.name, ignore_errors=True)
            logger.debug('Old repository %s deleted.', self.name)

        os.makedirs(self.name)
        GitRepo.clone_from(git_url, self.name)

        logger.debug('Repository %s cloned.', self.name)

    def _create_venv(self):

        logger.debug('Creating virtual environment for repository %s.',
                     self.name)
        virtualenv.create_environment(self.name + '/venv')

        src_req = self.config["dependencies"]["src"]
        tests_req = self.config["dependencies"]["tests"]
        setup_req = self.config["dependencies"]["setup"]

        if src_req:
            subprocess.call([self.name + '/venv/bin/pip',
                            'install', '-r', self.name + '/' + src_req])
        if tests_req:
            subprocess.call([self.name + '/venv/bin/pip',
                            'install', '-r', self.name + '/' + tests_req])
        if setup_req:
            subprocess.call([self.name + '/venv/bin/pip',
                            'install', setup_req])

        logger.debug('Virtual environment for repository %s created.',
                     self.name)

    def _stop_fuzzing(self):

        if self._current_fuzzing_task:
            logger.debug('Stopping fuzzing for repository %s.', self.name)
            self._current_fuzzing_task.running = False
            self._current_fuzzing_task.join()
            logger.debug('Fuzzing for repository %s stopped.', self.name)

    def _start_fuzzing(self):

        logger.debug('Starting fuzzing for repository %s.', self.name)

        self._fuzz_start_time = datetime.datetime.now()
        self._current_fuzzing_task = \
            threading.Thread(target=self._fuzz_task,
                             args=())
        self._current_fuzzing_task.start()

        logger.debug('Fuzzing for repository %s started.', self.name)

    def _fuzz_task(self):

        logger.debug('Fuzzing task of repository %s.', self.name)

        iteration = 0

        while getattr(self._current_fuzzing_task, "running", True):
            logger.info('Fuzzing iteration %s.', iteration)
            subprocess.call([self.name + '/venv/bin/pytest',
                             '--hypothesis-output=' + self.name + '.json',
                             self.name],
                            universal_newlines=True,
                            stdout=subprocess.PIPE)
            print('Fuzzing iteration: ', iteration)
            iteration += 1
        print('Fuzzing stopped after', iteration, 'iterations')

        logger.debug('Task of repository %s fuzzed.', self.name)

    def _load_config(self, config):

        if 'name' not in config:
            logger.error('Repo configuration missing name.', exc_info=True)
            raise ConfigMissingOptionException("Repo configuration" +
                                               "missing a 'name' attribute")

        if 'owner' not in config:
            logger.error('Repo configuration missing owner.', exc_info=True)
            raise ConfigMissingOptionException("Repo configuration" +
                                               "missing an 'owner' attribute")

        self.config = config

    def _check_dir(self):

        logger.debug('Checking directory of repository %s.', self.name)

        if os.path.basename(os.getcwd()) != self.name:
            raise WrongDirectoryException(os.path.basename(os.getcwd()),
                                          self.name)
