export async function runScan(target: string) {
  const response = await fetch("http://localhost:5000/api/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ target }),
  });

  if (!response.ok) {
    throw new Error("Scan failed");
  }

  return response.json();
}