# Hypothesis Server

An addon for the [Hypothesis](https://github.com/HypothesisWorks/hypothesis) testing library that enables continuous fuzzing tests on a dedicated server.

## Getting Started

Install the package:

```
pip install hypothesisfuzzer
```

Then, create a server:

```python
from hypothesisfuzzer import FuzzServer

app = FuzzServer(config_path='config.yml')
app.run()
```

This will automatically start running a server which will read from the supplied config path.

The server does 3 things:
  - When it receives a GitHub webhook HTTP request to its `/webhook` route, it will (provided the configuration has been set up correctly), it will start running indefinite Hypothesis tests.
  - There is a `/get_errors` route which will return all the error inputs for the tests which were found through the continuous fuzzing process. You may choose to integrate this with CI and local development testing.
  - Last but not least, there is a front end web UI in React that allows you to see current fuzzing progress, failing test cases for different repos, etc.

## Config file

In a YAML configuration file,
```YAML
repos:
  -repo1:
    git_url: https://github.com/hypothesis-imperial/fuzzing-sample-product-poc.git
    project_root: "" # Optional; Default is just git directory root
    branch: master # optional; Default master
    requirements_file: requirements.txt # Optional: Default in project_root normally; otherwise give path relative to project_root
    tests_folder: tests # Optional: Default is "test" in project_root
    fuzz_on_start: True # Optional: Whether to pull and start fuzzing on server start, Default True

  -repo2:
    git_url: https://github.com/hypothesis-imperial/not-a-real-repo.git
    project_root: part-one
    branch: develop
    requirements_file: ../requirements.txt
    tests_folder: tests #in part-one
    fuzz_on_start: False
```

## Authors

* **Jack Pordi** [jackel119](https://github.com/jackel119)
* **Romaine de Spoelberch** [romdespoel](https://github.com/romdespoel)
* **David Kurniadi Angdinata** [Multramate](https://github.com/Multramate)
* **Cassie Ying** [cassie-ying](https://github.com/cassie-ying)
* **Lan Yi** [lanyielaine](https://github.com/lanyielaine)

See also the list of [contributors](https://github.com/hypothesis-imperial/hypothesis-server/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* David MacIver, the original author of Hypothesis, for being so helpful during the development of this project during our third year group project at Imperial College London
* Robert Chatley, our group project supervisor who gave us invaluable advice and mentorship
