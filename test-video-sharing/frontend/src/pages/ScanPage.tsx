import { useState, useEffect } from "react";
import { runScan, getStatus, getReport } from "../services/ScanService";

export default function ScanPage() {
  const [target, setTarget] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleScan = async () => {
    const res = await runScan(target);
    setTaskId(res.task_id);
    setStatus("Started");
  };

  // 🔁 Poll status
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      const res = await getStatus(taskId);

      setStatus(res.status);

      if (res.status === "Done" && res.report_id) {
        setReportId(res.report_id);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [taskId]);

  // 📊 Fetch report
  useEffect(() => {
    if (!reportId) return;

    const fetchData = async () => {
      const data = await getReport(reportId);
      setResults(data);
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

      <button onClick={handleScan}>Run Scan</button>

      <p>Status: {status}</p>

      <h2>Results</h2>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            {r.name} | Severity: {r.severity} | Host: {r.host}
          </li>
        ))}
      </ul>
    </div>
  );
}