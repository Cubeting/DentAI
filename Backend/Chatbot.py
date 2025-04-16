import requests

API_URL = "http://localhost:3000/api/v1/prediction/5471f2f8-fd0d-4e00-aa6c-b78f753e1e60"

def query(payload):
    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()  # Raise an error for HTTP codes 4xx/5xx
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

output = query({
    "question": "Hey, how are you?",
})
print(output)