import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/black-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      // Error is handled in the AuthContext
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid"
            style={{ maxHeight: "150px" }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
