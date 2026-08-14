import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    onLogin({
      name: email.split("@")[0],
      email: email,
    });

    navigate("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <p>NOVA ACCOUNT</p>
          <h1>Welcome Back</h1>
          <span>
            Login to continue shopping with NOVA.
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link to="/register">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;