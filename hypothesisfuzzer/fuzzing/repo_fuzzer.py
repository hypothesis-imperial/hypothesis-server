import json
import os
import logging
import subprocess
import threading
import virtualenv

from git import Repo as GitRepo
from datetime import datetime
from ..errors import (
    no_code_dir_error,
    generic_error,
    ConfigMissingOptionException,
    WrongDirectoryException
)


logger = logging.getLogger('fuzz_server.' + __name__)


class RepoFuzzer:

    def __init__(self, name, config):

        logger.debug('Initialising repository %s fuzzer.', name)

        self.name = name
        self._load_config(config)

        # Fuzzing status
        self._ready = False
        self._currently_fuzzing = False
        self._iterations = 0
        self._status = None
        self._project_root = self.name
        self._fuzz_start_time = None

        if "project_root" in self.config:
            self._project_root = self.name + '/' + self.config["project_root"]
        self._clone_git(config['git_url'])
        self._create_venv()
        self._error_results = {}

        logger.info('Repository %s fuzzer initialised.', name)

    def start(self):

        logger.debug('Starting fuzzing for repository %s.', self.name)

        self._start_fuzzing()

        logger.debug('Fuzzing for repository %s started.', self.name)

    def on_webhook(self, payload):

        logger.debug('Webhook event triggered')

        # Check if repo is the same name as the one set in config
        payload_name = payload["repository"]["name"]
        config_name = self.config['name']
        try:
            if payload_name != config_name:
                logger.warning('Repository %s is different from %s.',
                               payload_name, config_name)
                return 'OK'
        except KeyError:
            logger.info('Repository %s is as configured.', payload_name)
            pass

        self._clone_git(self.config['git_url'])

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

        status_info = self._error_results

        status_info['repo_name'] = self.name
        status_info['owner'] = self.config['owner']
        status_info['start'] = self._fuzz_start_time
        status_info['duration'] = str(datetime.now() - self._fuzz_start_time)
        status_info['iterations'] = self._iterations
        status_info['fuzzing'] = self._currently_fuzzing
        status_info['ready'] = self._ready

        return status_info

    def _clone_git(self, git_url):

        logger.debug('Cloning/pulling repository %s.', self.name)

        try:
            if os.path.exists(self.name):
                try:
                    GitRepo(self.name).git.reset('--hard', 'origin')
                    GitRepo(self.name).git.pull()
                    logger.debug('Repository %s pulled.', self.name)
                except Exception:
                    logger.error('Unable to pull invalid repository %s.',
                                 self.name)

                    return generic_error(msg='Error updating Git Repo! ' +
                                             'Please ensure the path ' +
                                             'is a valid Git Repo.')
            else:
                os.makedirs(self.name)
                GitRepo.clone_from(git_url, self.name)
                logger.debug('Repository %s cloned.', self.name)
        except Exception:
            logger.error('Unable to access repository %s.', self.name)

            return generic_error(msg='Error cloning/pulling Git Repo! ' +
                                     'Please ensure you have access.')

    def _create_venv(self):

        def pip_install(target):
            # Target is a string
            return subprocess.run(['venv/bin/pip', 'install'] +
                                  target.split(),
                                  cwd=self._project_root)

        logger.debug('Creating virtual environment for repository %s.',
                     self.name)

        if not os.path.isdir(self._project_root + '/venv'):
            virtualenv.create_environment(self._project_root + '/venv')

        if "dependencies" in self.config:
            # Install dependencies
            for dep_name, target in self.config["dependencies"].items():
                if os.path.isfile(self._project_root + '/' + target):
                    to_install = "-r " + target
                else:
                    to_install = target

                install_result = pip_install(to_install)

                if install_result.returncode != 0:
                    self._ready = False
                    msg = 'Failed to install dependency set ' \
                        + dep_name + ': ' + target
                    self._status = msg
                    logger.error(msg)
                    return

        else:
            # Look for requirements file

            if os.path.isfile(self._project_root + '/requirements.txt'):
                pip_install('-r requirements.txt')
            else:
                logger.warning('No dependencies specified for repository %s, '
                               'and no requirements.txt found.', self.name)

        self._ready = True
        logger.debug('Virtual environment for repository %s created.',
                     self.name)

    def _stop_fuzzing(self):

        if self._current_fuzzing_task:
            logger.debug('Stopping fuzzing for repository %s.', self.name)
            self._current_fuzzing_task.running = False
            self._current_fuzzing_task.join()
            logger.debug('Fuzzing for repository %s stopped.', self.name)
            self._currently_fuzzing = False

    def _start_fuzzing(self):

        if not self._ready:
            logger.error('Fuzzer not ready.')
            return

        logger.debug('Starting fuzzing for repository %s.', self.name)

        self._currently_fuzzing = True
        self._iterations = 0
        self._fuzz_start_time = datetime.now()

        self._current_fuzzing_task = \
            threading.Thread(target=self._fuzz_task, args=())
        self._current_fuzzing_task.start()

        logger.debug('Fuzzing for repository %s started.', self.name)

    def _fuzz_task(self):

        logger.debug('Fuzzing task of repository %s.', self.name)

        while getattr(self._current_fuzzing_task, "running", True):

            logger.info('Fuzzing iteration %s.', self._iterations)
            params = ['venv/bin/pytest', '-m hypothesis',
                      '--hypothesis-server',
                      '--hypothesis-output=' + self.name + '.json']

            if "tests_folder" in self.config:
                params.append(self.config["tests_folder"])
            result = subprocess.run(params,
                                    universal_newlines=True,
                                    stdout=subprocess.PIPE,
                                    cwd=self._project_root)

            if result.returncode == 0:
                pass
            elif result.returncode == 1:
                logger.info('Some tests failed.')
            else:
                self._ready = False
                self._currently_fuzzing = False
                self._status = 'Test execution interrupted by error.'
                logger.warning('Test execution interrupted by error.')
                return

            try:
                with open(self._project_root + '/' +
                          self.name + '.json', 'r') as file_data:
                    self._error_results = json.load(file_data)
            except IOError:
                logger.error('Repository %s not producing output json.',
                             self.name)

            self._iterations += 1
            print('Fuzzing ' + self.name +
                  ' iteration ' + str(self._iterations) + '.')

        logger.debug('Fuzzing of ' + self.name + ' stopped after '
                     + str(self._iterations) + ' iterations.')

        logger.debug('Task of repository %s fuzzed.', self.name)

    def _load_config(self, config):

        if 'name' not in config:
            logger.error('Repo configuration missing name.')
            raise ConfigMissingOptionException('Repo configuration ' +
                                               'missing a name attribute.')

        if 'owner' not in config:
            logger.error('Repo configuration missing owner.')
            raise ConfigMissingOptionException('Repo configuration ' +
                                               'missing an owner attribute.')

        self.config = config

    def _check_dir(self):

        logger.debug('Checking directory of repository %s.', self.name)

        if os.path.basename(os.getcwd()) != self.name:
            raise WrongDirectoryException(os.path.basename(os.getcwd()),
                                          self.name)
