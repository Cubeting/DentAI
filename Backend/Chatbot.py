from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

API_KEY = "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"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
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
            res.raise_for_status()
            result = res.json()
            logging.debug(f"Respons dari API eksternal: {result}")
            return jsonify({"response": result["choices"][0]["message"]["content"]})
        except requests.exceptions.RequestException as e:
            logging.error(f"Error saat menghubungi API eksternal: {e}")
            return jsonify({"error": "Gagal menghubungi API eksternal", "details": str(e)}), 500
    except Exception as e:
        logging.error(f"Error lain: {e}")
        return jsonify({"error": "Terjadi kesalahan pada server", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
