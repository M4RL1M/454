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
        # print("---- DEBUG START ----")
        # print("CONFIG IDS:", config_ids)
        config_id = config_ids[0]

        # Get the first available scanner
        scanners_xml = gmp.get_scanners()
        scanners = etree.fromstring(scanners_xml.encode())
        scanner_ids = scanners.xpath("/*/scanner/@id")
        if not scanner_ids:
            raise Exception("No scanners found")
        # print("SCANNER IDS:", scanner_ids)
        scanner_id = scanner_ids[0]

        # Get the first available port list
        port_lists_xml = gmp.get_port_lists()
        port_lists = etree.fromstring(port_lists_xml.encode())
        port_list_ids = port_lists.xpath("//port_list/@id")
        if not port_list_ids:
            raise Exception("No port lists found")
        # print("PORT LIST IDS:", port_list_ids)
        port_list_id = port_list_ids[0]

        targets_xml = gmp.get_targets()
        targets = etree.fromstring(targets_xml.encode())
        existing = targets.xpath(f"//target[name='target-{target}']/@id")
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

        tasks_xml = gmp.get_tasks()
        tasks = etree.fromstring(tasks_xml.encode())
        existing_tasks = tasks.xpath(f"//task[name='task-{target}']/@id")
        if existing_tasks:
            task_id = existing_tasks[0]
        else:
            task_response = gmp.create_task(
                name=f"task-{target}",
                config_id=config_id,
                target_id=target_id,
                scanner_id=scanner_id
            )

            task_xml = etree.fromstring(task_response.encode())
            task_id = task_xml.xpath("/*/@id")[0]

        # Start the task
        start_response = gmp.start_task(task_id=task_id)
        start_xml = etree.fromstring(start_response.encode())
        # print("START RESPONSE:", start_response)
        # print("---- DEBUG END ----")
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

        # Get report
        report_xml = gmp.get_report(report_id=report_id)
        report = etree.fromstring(report_xml.encode())

        results = []

        for r in report.xpath("//result"):
            name = r.xpath("name/text()")
            severity = r.xpath("severity/text()")
            host = r.xpath("host/text()")

            results.append({
                "name": name[0] if name else "Unknown",
                "severity": severity[0] if severity else "0",
                "host": host[0] if host else "Unknown"
            })

        return results