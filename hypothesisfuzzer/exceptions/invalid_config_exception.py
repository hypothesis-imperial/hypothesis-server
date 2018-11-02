class InvalidConfigException(Exception):
    def __init__(self, *args, **kwargs):
        Exception.__init__(self, *args, **kwargs)


class ConfigMissingOptionException(InvalidConfigException):
    def __init__(self, *args, **kwargs):
        InvalidConfigException.__init__(self, *args, **kwargs)
