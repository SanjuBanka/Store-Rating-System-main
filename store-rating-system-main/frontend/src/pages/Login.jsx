import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
  "token",
  res.data.token
);

localStorage.setItem(
  "role",
  res.data.role
);

localStorage.setItem(
  "userId",
  res.data.user.id
);

localStorage.setItem(
  "storeId",
  res.data.storeId
);

      // Auto Redirect Based On Role
      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else if (res.data.role === "USER") {
        navigate("/user");
      } else if (
        res.data.role === "STORE_OWNER"
      ) {
        navigate("/owner");
      }

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg,#4f46e5,#06b6d4)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "450px",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-center mb-2">
          Store Rating System
        </h2>

        <p className="text-center text-muted mb-4">
          Login to your account
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
          >
            Login
          </button>

          {/* User Signup Only */}
          <div className="text-center mt-3">

  <p>
    Don't have an account?
  </p>

  <button
    className="btn btn-outline-primary w-100"
    onClick={() => navigate("/signup")}
  >
    Create New Account
  </button>

</div>
        </form>

        <hr />

<h5>Demo Credentials</h5>

<div className="alert alert-light">

  <p>
    <strong>Admin</strong><br />
    admin@gmail.com
  </p>

  <p>
    <strong>Store Owner</strong><br />
    owner@gmail.com
  </p>

  <p>
    <strong>User</strong><br />
    anuksha@gmail.com
  </p>
          <p className="text-success fw-bold mb-0">
            Only Users Can Sign Up
          </p>
        </div>
        <div className="text-center mt-4">

  <small className="text-muted">
    Store Rating System © 2026
  </small>

</div>
      </div>
    </div>

    
  );
}

export default Login;