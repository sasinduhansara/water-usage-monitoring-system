import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async () => {
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.error || "Login failed");
    }
  };

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;

  // ===== STYLES =====
  const wrapper = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  };

  const container = {
    display: "flex",
    flexDirection: "column",
    width: isSmallMobile ? "90%" : isMobile ? "85%" : "320px",
    gap: "12px",
    padding: isSmallMobile ? "15px" : "25px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    color: "#fff",
  };

  const inputStyle = {
    padding: "12px",
    fontSize: "14px",
    border: "none",
    borderRadius: "8px",
    outline: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
  };

  const buttonStyle = {
    padding: "12px",
    fontSize: "15px",
    background: "linear-gradient(45deg, #00c6ff, #0072ff)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  };

  const buttonHover = (e) => {
    e.target.style.opacity = "0.8";
  };

  const buttonLeave = (e) => {
    e.target.style.opacity = "1";
  };

  return (
    <div style={wrapper}>
      <div style={container}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "10px",
          }}
        >
          🔐 Login
        </h2>

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          style={buttonStyle}
          onMouseEnter={buttonHover}
          onMouseLeave={buttonLeave}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#00c6ff",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
