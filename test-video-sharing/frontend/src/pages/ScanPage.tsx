import { useState } from "react";
import { runScan } from "../services/ScanService";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScan = async () => {
    setLoading(true);

    if (!target.trim()) {
        alert("Please enter a target");
        return;
    }

    try {
      const res = await runScan(target);
      setResult(res);
    } catch (err) {
      setResult({ error: "Scan failed" });
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Scanner</h1>

      <input
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Target IP or domain"
      />

      <button onClick={handleScan}>Run Scan</button>

      {loading && <p>Scanning...</p>}

      {result?.error && (
        <p style={{ color: "red" }}>{result.error}</p>
      )}

      {result?.vulnerabilities && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}

      <button
        onClick={() => navigate("/info")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Information
      </button>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Back to Sign In;
      </button>
    </div>
  );
}
