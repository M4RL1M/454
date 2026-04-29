import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/info");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign In</h2>

      <button onClick={handleSignIn}>Enter</button>
    </div>
  );
}