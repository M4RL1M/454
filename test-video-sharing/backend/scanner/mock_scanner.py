# A mock scanner module to simulate scanning behavior for testing purposes
def run_mock_scan(target):
    return {
        "target": target,
        "status": "GVM integration pending",
        "vulnerabilities": []
    }