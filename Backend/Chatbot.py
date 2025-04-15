from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "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"

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

    res = requests.post("https://api.together.xyz/v1/chat/completions", headers=headers, json=data)
    result = res.json()
    return jsonify({"response": result["choices"][0]["message"]["content"]})

if __name__ == '__main__':
    app.run(debug=True)
