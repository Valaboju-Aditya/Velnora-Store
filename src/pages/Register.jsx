import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const newUser = {
      name: name,
      email: email,
    };

    onRegister(newUser);

    navigate("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <p>NOVA ACCOUNT</p>

          <h1>Create Account</h1>

          <span>
            Join NOVA and discover your own style.
          </span>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
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
            Create Account
          </button>

        </form>

        <div className="auth-footer">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;