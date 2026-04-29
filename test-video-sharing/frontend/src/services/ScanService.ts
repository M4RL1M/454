const API_URL = "http://localhost:5000/api/scan";

export const runScan = async (target: string, mode: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      target,
      mode
    }),
  });
  return res.json();
}

export const getStatus = async (taskId: string) => {
  const res = await fetch(`${API_URL}/status/${taskId}`);
  return res.json();
}

export const getReport = async (reportId: string) => {
  const res = await fetch(`${API_URL}/report/${reportId}`);
  return res.json();
}