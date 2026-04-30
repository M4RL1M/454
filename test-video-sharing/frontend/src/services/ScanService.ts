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
  
  const data = await res.json();
  
  // Handle backend errors involving running scans
  if (data.Error || data.error) {
    throw new Error(data.Error || data.error);
  }
  
  return data;
}

export const getStatus = async (taskId: string) => {
  const res = await fetch(`${API_URL}/status/${taskId}`);
  const data = await res.json();

  // Handle backend errors involving fetching scan status
  if (data.Error || data.error) {
    throw new Error(data.Error || data.error);
  }
  
  return data;
}

export const getReport = async (reportId: string) => {
  const res = await fetch(`${API_URL}/report/${reportId}`);
  const data = await res.json();

  // Handle backend errors involving fetching scan reports
  if (data.Error || data.error) {
    throw new Error(data.Error || data.error);
  }
  
  return data;
}