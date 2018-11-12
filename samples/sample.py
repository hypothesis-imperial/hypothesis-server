from hypothesisfuzzer import FuzzServer

app = FuzzServer(config_path='sample_config.yml')
app.run(debug=True)
