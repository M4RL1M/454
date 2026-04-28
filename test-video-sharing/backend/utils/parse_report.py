import xml.etree.ElementTree as ET

def parse_gvm_report(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    results = []

    for result in root.findall(".//result"):
        results.append({
            "name": result.findtext("name"),
            "severity": result.findtext("severity"),
            "description": result.findtext("description"),
            "port": result.findtext("port"),
        })

    return results