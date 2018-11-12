import requests
import json

with open("sample_webhook_payload.json") as file:
    data = json.load(file)
    response = requests.post("http://127.0.0.1:5000/webhook", json=data)
    print(response)
