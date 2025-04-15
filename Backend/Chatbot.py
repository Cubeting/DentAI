from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

# Get API Key from environment variables
API_KEY = os.getenv("API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_prompt = request.json['prompt']

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "HTTP-Referer": "http://dent-ai-web.vercel.app",
            "X-Title": "DentAI",
            "Content-Type": "application/json"
        }

        data = {
            "model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "messages": [{"role": "user", "content": user_prompt}]
        }

        try:
            res = requests.post("https://hook.eu2.make.com/i9it7d9k2rgqg92ymlamyj3kqov38s1h", headers=headers, json=data)
            res.raise_for_status()
            result = res.json()
            logging.debug(f"Respons lengkap dari API eksternal: {result}")
            logging.debug(f"Respons dari API eksternal: {result}")
            
            # Periksa apakah respons memiliki struktur yang diharapkan
            if "choices" in result and len(result["choices"]) > 0 and "message" in result["choices"][0]:
                return jsonify({"response": result["response"]})
            else:
                logging.error(f"Struktur respons tidak valid: {result}")
                return jsonify({"error": "Struktur respons tidak valid"}), 500
        except requests.exceptions.RequestException as e:
            logging.error(f"Error saat menghubungi API eksternal: {e}")
            if e.response is not None:
                logging.error(f"Respons error dari API eksternal: {e.response.text}")
            return jsonify({"error": "Gagal menghubungi API eksternal", "details": str(e)}), 500
    except Exception as e:
        logging.error(f"Error lain: {e}")
        return jsonify({"error": "Terjadi kesalahan pada server", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
