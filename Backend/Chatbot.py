import requests

API_URL = "http://localhost:3000/api/v1/prediction/5471f2f8-fd0d-4e00-aa6c-b78f753e1e60"

def query(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()
    
output = query({
    "question": "Hey, how are you?",
})