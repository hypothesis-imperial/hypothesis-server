import setuptools
import subprocess

from setuptools.command.install import install


# class BuildFrontEnd(install):
#     def run(self):
#         subprocess.check_call(['npm install'.split()])
#         subprocess.check_call(['npm run build'.split()])
#         install.run(self)


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
        'pyyaml',
        'flask-cors',
        'flask-sqlalchemy',
        'virtualenv'
    ],
    include_package_data=True
    # cmdclass={
    #     'build_front_end': BuildFrontEnd,
    # }
)
