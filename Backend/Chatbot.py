from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    user_prompt = request.json['prompt']

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistral-7b-instruct-v0.2",
        "messages": [{"role": "user", "content": user_prompt}],
        "temperature": 0.7,
        "max_tokens": 1000
    }

    try:
        res = requests.post("https://api.together.xyz/v1/chat/completions", headers=headers, json=data)
        res.raise_for_status()  # Akan memunculkan exception jika status code bukan 2xx
        result = res.json()
        return jsonify({"response": result["choices"][0]["message"]["content"]})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Gagal menghubungi API eksternal", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
