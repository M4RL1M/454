import { useNavigate } from "react-router-dom";

export default function InformationPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Information Page</h2>

      <p>Welcome to the vulnerability scanner project.</p>

      <button onClick={() => navigate("/scan")}>
        Go to Scan Page
      </button>
    </div>
  );
}