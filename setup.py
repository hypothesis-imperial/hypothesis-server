import setuptools

from setuptools.command.build_py import build_py


class NPMInstall(build_py):
    def run(self):
        self.run_command('npm install')
        build_py.run(self)


class NPMBuild(build_py):
    def run(self):
        self.run_command('npm run build')
        build_py.run(self)


with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="hypothesisfuzzer",
    version="0.0.1",
    author="Example Author",
    author_email="author@example.com",
    description="A small example package",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/hypothesis-imperial/hypothesis-server",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    install_requires=[
        'gitpython',
        'pytest',
        'flask',
        'flask-sqlalchemy'
    ],
    include_package_data=True,
    cmdclass={
        'npm_install': NPMInstall,
        'npm_build': NPMBuild
    }
)
