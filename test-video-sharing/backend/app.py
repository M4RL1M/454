from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

from scanner.mock_scanner import run_mock_scan
from scanner.gvm_docker import run_gvm_scan, get_scan_status, get_report
from utils.parse_report import parse_gvm_report

load_dotenv()  # Load environment variables from .env file
app = Flask(__name__)
CORS(app)

@app.route("/api/scan", methods=["POST"])
def scan():
    data = request.json
    target = data.get("target")

    if not target:
        return jsonify({"Error": "No target provided"}), 400

    try:
        result = run_gvm_scan(target)
        # Return the result of starting the scan (e.g., task ID, report ID)
        return jsonify(result)
    except Exception as e:
        # If any error occurs (e.g., scan failed, connection error)
        return jsonify({"Error": str(e)}), 500
    
@app.route("/api/scan/status/<task_id>", methods=["GET"])
def scan_status(task_id):
    try:
        result = get_scan_status(task_id)
        # Attempt to get scan status from GVM
        return jsonify(result)
    except Exception as e:
        # If any error occurs (e.g., task not found, connection error)
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/scan/report/<report_id>", methods=["GET"])
def scan_report(report_id):
    try:
        # Attempt to get raw report data from GVM
        result = get_report(report_id)
        # Parse the raw XML report into structured data
        # parsed = parse_gvm_report(raw)
        # Return the parsed report as JSON
        return jsonify(result)
    except Exception as e:
        # If any error occurs (e.g., report not ready, parsing error)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)