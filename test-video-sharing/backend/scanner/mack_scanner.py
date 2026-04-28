import sys
import json
import time

target = sys.argv[1]

# simulate scan delay
time.sleep(3)

output = {
    "total": 3,
    "high": 1,
    "medium": 1,
    "low": 1,
    "results": [
        {
            "name": "SSL Certificate Issue",
            "severity": 8.2,
            "host": target,
            "port": "443",
            "description": "Certificate expired or weak encryption"
        },
        {
            "name": "Open Port Detected",
            "severity": 5.0,
            "host": target,
            "port": "22",
            "description": "SSH port exposed"
        },
        {
            "name": "Information Disclosure",
            "severity": 2.5,
            "host": target,
            "port": "80",
            "description": "Server version exposed"
        }
    ]
}

print(json.dumps(output))