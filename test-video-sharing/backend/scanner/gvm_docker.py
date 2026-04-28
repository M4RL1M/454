import subprocess
import time
from .parse_report import parse_gvm_report

REPORT_PATH = "/tmp/gvm_report.xml"

def run_gvm_scan(target):
    try:
        subprocess.run([
            "docker", "exec", "gvm",
            "gvm-cli", "socket",
            "--xml", f"<create_target><name>{target}</name><hosts>{target}</hosts></create_target>"
        ], check=True)

        subprocess.run([
            "docker", "exec", "gvm",
            "gvm-cli", "socket",
            "--xml", f"<create_task><name>scan-{target}</name></create_task>"
        ], check=True)

        subprocess.run([
            "docker", "exec", "gvm",
            "gvm-cli", "socket",
            "--xml", "<start_task task_id='1'/>"
        ], check=True)

        time.sleep(60)

        subprocess.run([
            "docker", "exec", "gvm",
            "gvm-cli", "socket",
            "--xml", "<get_reports/>"
        ], stdout=open(REPORT_PATH, "w"))

        parsed = parse_gvm_report(REPORT_PATH)

        return {
            "target": target,
            "status": "completed",
            "results": parsed
        }

    except Exception as e:
        return {
            "target": target,
            "status": "error",
            "error": str(e)
        }