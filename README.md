# Hypothesis Server

An addon for the [Hypothesis](https://github.com/HypothesisWorks/hypothesis) testing library that enables continuous fuzzing tests on a dedicated server.

## Getting Started

Install the package

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
  - When it received a GitHub webhook HTTP request to its `/webhook` route, it will (provided the configuration has been set up correctly, it will start running indefinite Hypothesis tests.
  - There is a `/get_errors` route which will return all the error inputs for the tests which were found through the continuous fuzzing process. You may choose to integrate this with CI and local development testing.
  - Last but not least, there is a front end web UI in React that allows you to see current fuzzing progress, failing test cases for different repos, etc.

## Config file

In a YAML configuration file,
```YAML
repos:
  -repo1:
    git_url: https://github.com/hypothesis-imperial/fuzzing-sample-product-poc.git
    project_root: "" # optional; Default is just git directory root
    branch: master #optional; Default master
    requirements_file: requirements.txt # Default in project_root normally; otherwise give path relative to project_root
    tests_folder: tests # default is "test" in project_root
    fuzz_on_start: True # Whether to pull and start fuzzing on server start, Default True

  -repo2:
    git_url: https://github.com/hypothesis-imperial/not-a-real-repo.git
    project_root: part-one
    branch: develop
    requirements_file: ../requirements.txt
    tests_folder: tests #in part-one
    fuzz_on_start: False
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
