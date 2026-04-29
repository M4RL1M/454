const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function runScan(target: string) {
  const response = await fetch(`${API_URL}/api/scan`, {
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