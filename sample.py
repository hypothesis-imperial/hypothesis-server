from .hypothesisfuzzer import Fuzzer

app = Fuzzer(config_path='sample_config')
print(app.config)
app.run()
