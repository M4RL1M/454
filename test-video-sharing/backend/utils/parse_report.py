from lxml import etree

def parse_gvm_report(xml_data):
    root = etree.fromstring(xml_data.encode())

    results = []

    # Iterate over each result in the report and extract relevant information
    for result in root.xpath("//result"):
        results.append({
            "name": result.findtext("name"),
            "severity": result.findtext("severity"),
            "host": result.findtext("host"),
            "port": result.findtext("port"),
            "description": result.findtext("description")
        })

    # Return the list of parsed results
    return results