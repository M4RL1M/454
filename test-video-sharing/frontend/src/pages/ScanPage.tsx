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

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}

      <button onClick={() => navigate("/info")}>
        Back to Information
      </button>
      
      <button onClick={() => navigate("/")}>
        Back to Sign In
      </button>
    </div>
  );
}
