from flask import Flask, request, jsonify
from flask_cors import CORS

from scanner.mock_scanner import run_mock_scan
from scanner.gvm_docker import run_gvm_scan

app = Flask(__name__)
CORS(app)

USE_GVM = False  # toggle

@app.route("/api/scan", methods=["POST"])
def scan():
    data = request.json
    target = data.get("target")

    if not target:
        return jsonify({"error": "No target provided"}), 400

    if USE_GVM:
        result = run_gvm_scan(target)
    else:
        result = run_mock_scan(target)

    return jsonify(result)

if __name__ == "main":
    app.run(debug=True)