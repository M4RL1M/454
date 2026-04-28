import { useNavigate } from "react-router-dom";

export default function InformationPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Welcome to the Vulnerability Scanner</h1>

      <p>
        This application allows you to run vulnerability scans on a given target
        (IP address or domain) using different scanning methods.
      </p>

      <h2>Features</h2>
      <ul>
        <li>Run scans on IPs or domains</li>
        <li>View detected vulnerabilities</li>
        <li>Switch between mock and real scanners</li>
      </ul>

      <h2>How It Works</h2>
      <p>
        When you run a scan, the frontend sends a request to the backend API.
        The backend then uses either a mock scanner (for testing) or a real
        vulnerability scanner to analyze the target and return results.
      </p>

      <h2>Getting Started</h2>
      <p>
        Click the button below to begin scanning a target.
      </p>

      <button
        onClick={() => navigate("/scan")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Vulnerability Scanner
      </button>

      <button onClick={() => navigate("/")}>
        Back to Sign In
      </button>
    </div>
  );
}