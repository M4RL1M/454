import { useState, useEffect } from "react";
import { runScan, getStatus, getReport } from "../services/ScanService";

export default function ScanPage() {
  const [mode, setMode] = useState<string>("fast");
  const [target, setTarget] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"fast" | "full">("fast");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleScan = async () => {
    try {
      setStatus("Running");
      setResults([]);
      // Clean the input (remove leading https)
      const cleanTarget = target.replace(/^https?:\/\//,"").trim();
      const res = await runScan(cleanTarget, scanMode);
      if (res.status === "already running") {
        setTaskId(res.task_id);
        setStatus("Running")
        return;
      }
      setMode(res.mode || scanMode);
      setTaskId(res.task_id)
    } catch (err) {
      console.error(err);
      setStatus("Error Starting Scan")
    }
  };

  // Poll status
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getStatus(taskId);

        setStatus(res.status);

        if (res.mode) {
          setMode(res.mode);
        }

        if (res.status === "Done" && res.report_id) {
          setReportId(res.report_id);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error Fetching Status");
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [taskId]);

  // Fetch report
  useEffect(() => {
    if (!reportId) return;

    const fetchData = async () => {
      try {
        const data = await getReport(reportId);
        console.log("Report Data: ", data);

        if (Array.isArray(data)) {
          setResults(data);
        } else if (Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    };

    fetchData();
  }, [reportId]);

  return (
    <div>
      <h1>Scan Page</h1>

      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Enter target"
      />

      <select
        value = {scanMode}
        onChange={(e) => setScanMode(e.target.value as "fast" | "full")}
      >
          <option value="fast"> Fast Scan (Host Discovery) </option>
          <option value="full"> Full Scan (Full and Fast) </option>
      </select>

      <button onClick={handleScan} disabled={status === "Running"}>
        {status === "Running" ? "Scanning..." : "Run Scan"}
      </button>

      {status === "Error Starting Scan" && <p> Failed to start scan </p>}
      {status === "Running" && <p> Scan in progress... </p>}
      {status === "Done" && <p> Scan complete </p>}

      <p> 
        Mode: { mode === "fast" ? "Fast (Host Discovery)" :
                mode === "full" ? "Full (Full and Fast)" :
                "Unknown"}
      </p>

      <h2>Results</h2>
      <ul>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((r, i) => (
            <li key={i}>
              {r.name ?? "Unknown"} | Severity: {r.severity ?? "N/A"} | Host: {r.host ?? "N/A"}
            </li>
          ))
        ) : (
          <li>No results yet</li>
        )}
      </ul>
    </div>
  );
}