import { useState, useEffect } from "react";
import { runScan, getStatus, getReport } from "../services/ScanService";

export default function ScanPage() {
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<string>("fast");
  const [target, setTarget] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<"fast" | "full">("fast");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any[]>([]);

  // Compute elapsed time (in seconds) from start of scan
  const elapsedSeconds = startTime
    ? Math.floor((Date.now() - startTime) / 1000)
    : 0;

  // Statuses indicating a scan is ongoing (used to prevent scans from being
  // requested or queued during the runtime of another)
  const isScanning = ["Running", "Requested", "Queued"].includes(status);

  // Handle scan attempts
  const handleScan = async () => {
    try {
      setError(null);   // Clear previous errors
      setStartTime(Date.now()); // Retrieve scan start time
      setStatus("Requested");
      setResults([]);
      // Clean the input (remove leading https)
      const cleanTarget = target.replace(/^https?:\/\//,"").trim();
      // Initiate and wait for scan changes
      const res = await runScan(cleanTarget, scanMode);
      if (res.status === "already running") {
        // Scan request succeeds
        setTaskId(res.task_id);
        setStatus("Running");
        return;
      }
      setTaskId(res.task_id);
      setMode(scanMode);
    } catch (err: any) {
      // Scan request fails
      console.error(err);
      setError(err?.message || "Failed to start scan");
      setStatus("Error");
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

        if (res.report_id && !reportId) {
          // Update report id
          setReportId(res.report_id);
        } 
        if (res.status === "Done") {
          // Normal completion of scan
          clearInterval(interval)
        }

        // Time elapsed from start of scan
        const elapsed = startTime
          ? Math.floor((Date.now() - startTime) / 1000)
          : 0;

        if (res.report_id && elapsed > 60) {
          // Fallback when scan takes too long
          console.log("Fetching report early (long scan fallback)");
          setReportId(res.report_id);
          clearInterval(interval);
        }
        if (elapsed > 600) {
          // Scan timesout (10 minutes)
          setError("Scan took too long. Try again later");
          clearInterval(interval);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Error fetching scan status");
        setStatus("Error");
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
        // Retrieve report
        const data = await getReport(reportId);

        if (Array.isArray(data)) {
          setResults(data);
        } else if (Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err: any) {
        // Report retrieval fails
        console.error(err);
        setError(err?.message || "Error fetching report");
        setResults([]);
      }
    };

    fetchData();
  }, [reportId]);

  // Timer to force UI updates
  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      // Force re-render every second
      setStartTime((prev) => (prev ? prev : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

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

      <button onClick={handleScan} disabled={isScanning}>
        {isScanning ? "Scanning..." : "Run Scan"}
      </button>

      <p> 
        Mode: { mode === "fast" ? "Fast (Host Discovery)" :
                mode === "full" ? "Full (Full and Fast)" :
                "Unknown"}
      </p>

      {error && (
        <p style={{color: "red"}}> {error} </p>
      )}
      {isScanning && (
        <p>
          {elapsedSeconds < 30 && "Initializing Scan..."}
          {elapsedSeconds >= 30 && elapsedSeconds < 120 && "Scanning Target..."}
          {elapsedSeconds >= 120 && "Finalizing Results..."}
        </p>
      )}
      {status === "Done" && <p> Scan complete </p>}

      {status !== "Done" && reportId && (
        <button onClick={() => setReportId(reportId)}>
          Fetch Partial Results
        </button>
      )}

      <h2>Results</h2>
      {error ? (
        <p style={{ color: "red" }}> Unable to load results </p>
      ) : Array.isArray(results) && results.length > 0 ? (
        <ul>
          {results.map((r, i) => (
            <li key={i}>
              {r.name ?? "Unknown"} | Severity: {r.severity ?? "N/A"} | Host: {r.host ?? "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p> No results yet </p>
      )}
    </div>
  );
}