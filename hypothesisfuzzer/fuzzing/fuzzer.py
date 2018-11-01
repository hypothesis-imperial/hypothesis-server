import os
import virtualenv
import subprocess
import threading

from git import Repo


class Fuzzer:

    def __init__(self, git_url, folder_name="code"):
        self._current_fuzzing_task = None
        self.clone_git(git_url, folder_name=folder_name)
        self.create_venv(folder_name=folder_name)

    def clone_git(self, git_url, folder_name="code"):
        if os.path.exists(folder_name):
            raise Exception("Code directory already exists!")

        os.mkdirs(folder_name)
        Repo.clone_from(git_url, folder_name)

    def create_venv(self, folder_name="code"):
        os.chdir(folder_name)
        virtualenv.create_environment('venv')
        subprocess.run(['venv/bin/pip',
                        'install', '-r', 'requirements.txt'])

    def _stop_fuzzing(self):
        if self.current_fuzzing_task:
            self.current_fuzzing_task.running = False
            self.current_fuzzing_task.join()

    def _start_fuzzing(self, folder_name="Fuzzer"):
        def fuzz():
            def write_to_results(output):
                os.chdir("..")
                f = open("results.txt", "a")
                f.write(output.stdout)
                f.close()
                os.chdir("code")

            while getattr(self.current_fuzzing_task, "running", True):
                output = subprocess.run(['pytest', '-m', 'hypothesis',
                                         "--hypothesis-show-statistics"],
                                        universal_newlines=True,
                                        stdout=subprocess.PIPE)
                write_to_results(output)
                print('Did one iteration!')
            print('Stopped now')

        self._current_fuzzing_task = threading.Thread(target=fuzz, args=())
        self._current_fuzzing_task.start()
