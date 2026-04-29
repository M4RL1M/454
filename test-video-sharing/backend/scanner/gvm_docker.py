import ssl
import os
from gvm.connections import TLSConnection
from gvm.protocols.gmp import Gmp
from lxml import etree

def get_id(xml, label):
    ids = xml.xpath("/*/@id")
    if not ids:
        raise Exception(f"{label} creation failed: {etree.tostring(xml)}")
    return ids[0]

def run_gvm_scan(target):

    connection = TLSConnection(
        hostname=os.getenv("GVM_HOST"),
        port=int(os.getenv("GVM_PORT"))
    )

    with Gmp(connection) as gmp:
        gmp.authenticate(os.getenv("GVM_USER"), os.getenv("GVM_PASS"))

        # Get the "Full and fast" config
        configs_xml = gmp.get_scan_configs()
        configs = etree.fromstring(configs_xml.encode())
        config_ids = configs.xpath("//config[name='Full and fast']/@id")
        if not config_ids:
            raise Exception("Full and fast config not found")
        config_id = config_ids[0]
        # Explicitly set config to "Full and Fast"
        # config_id = "daba56c8-73ec-11df-a475-002264764cea"
        # print("Config ID:", config_id)

        # Get the first available scanner
        scanners_xml = gmp.get_scanners()
        scanners = etree.fromstring(scanners_xml.encode())
        # For loop below can tell us the ids of the scan types
        # for s in scanners.xpath("//scanner"):
        #    print("SCANNER:", s.xpath("name/text()")[0], s.get("id"))
        scanner_id = None
        for s in scanners.xpath("//scanner"):
            name = s.xpath("name/text()")[0]
            if "OpenVAS" in name:
                scanner_id = s.get("id")
                break
        if not scanner_id:
            raise Exception("OpenVAS scanner not found")

        # Get the first available port list
        port_lists_xml = gmp.get_port_lists()
        port_lists = etree.fromstring(port_lists_xml.encode())
        port_list_ids = port_lists.xpath("//port_list/@id")
        if not port_list_ids:
            raise Exception("No port lists found")
        # print("PORT LIST IDS:", port_list_ids)
        port_list_id = port_list_ids[0]

        # Create or Reuse the targets
        targets_xml = gmp.get_targets()
        targets = etree.fromstring(targets_xml.encode())
        existing = targets.xpath(f"//target[name='target-{target}']/@id")
        # If the target already exists, reuse it
        # Otherwise, create a new target
        if existing:
            target_id = existing[0]
        else:
            target_response = gmp.create_target(
                name=f"target-{target}",
                hosts=[target],
                port_list_id=port_list_id
            )

            target_xml = etree.fromstring(target_response.encode())
            target_id = target_xml.xpath("/*/@id")[0]

        # Create or Reuse tasks
        tasks_xml = gmp.get_tasks()
        tasks = etree.fromstring(tasks_xml.encode())
        task_id = None
        for t in tasks.xpath("//task"):
            name = t.xpath("name/text()")[0]
            # Similarly named task found.
            if name == f"task-{target}":
                existing_config = t.xpath("config/@id")[0]
                # If the task has the same config, reuse it
                if existing_config == config_id:
                    task_id = t.get("id")
                break
        # Create a new task if there is no existing one
        if not task_id:
            task_response = gmp.create_task(
                name=f"task-{target}",
                config_id=config_id,
                target_id=target_id,
                scanner_id=scanner_id
            )
            task_xml = etree.fromstring(task_response.encode())
            task_id = task_xml.xpath("/*/@id")[0]
            print("Created new task: ", task_id)
        else:
            print("Using existing task: ", task_id)

        # Start the task
        start_response = gmp.start_task(task_id=task_id)
        start_xml = etree.fromstring(start_response.encode())
        report_ids = start_xml.xpath("//report_id/text()")
        if not report_ids or report_ids[0] == "0":
            report_id = None
        else:
            report_id = report_ids[0]

        return {
            "status": "started",
            "task_id": task_id,
            "report_id": report_id
        }

def get_scan_status(task_id):
    connection = TLSConnection(
        hostname=os.getenv("GVM_HOST"),
        port=int(os.getenv("GVM_PORT")),
    )

    with Gmp(connection) as gmp:
        # Authenticate
        gmp.authenticate(
            os.getenv("GVM_USER"),
            os.getenv("GVM_PASS")
        )

        # Get task status
        task_xml = gmp.get_task(task_id=task_id)
        task = etree.fromstring(task_xml.encode())
        status = task.xpath("//status/text()")[0]

        report_ids = task.xpath("//last_report/report/@id")
        report_id = report_ids[0] if report_ids else None

        # Return the task status
        return {
            "status": status,
            "report_id": report_id
        }
    
def get_report(report_id):
    connection = TLSConnection(
        hostname=os.getenv("GVM_HOST"),
        port=int(os.getenv("GVM_PORT")),
    )

    with Gmp(connection) as gmp:
        # Authenticate
        gmp.authenticate(
            os.getenv("GVM_USER"),
            os.getenv("GVM_PASS")
        )

        # Get report (request full details)
        report_xml = gmp.get_report(
            report_id=report_id,
            details=True
        )
        report = etree.fromstring(report_xml.encode())

        results = []

        for r in report.xpath("//result"):
            name = get("name/text()")
            severity = get("severity/text()")
            host = get("host/text()")
            port = get("port/text()")
            description = get("description/text()")
            solution = get("solution/text()")

            # CVE Extraction
            cves = r.xpath(".//cve/text()")

            results.append({
                "name": name or "Unknown",
                "severity": float(severity) if severity else 0.0,
                "host": host or "Unknown",
                "port": port or "N/A",
                "description": description or "",
                "solution": solution or "",
                "cves": cves if cves else []
            })

        # Sort results by severity
        results.sort(key=lambda x: x["severity"], reverse=True)

        return results
    
    def get(xpath):
        val = r.xpath(xpath)
        return val[0] if val else None