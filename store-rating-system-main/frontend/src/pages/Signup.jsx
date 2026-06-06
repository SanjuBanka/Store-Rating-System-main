import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/signup", formData);

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup Failed"
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
          width: "500px",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-center mb-4">
          User Registration
        </h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-control mb-3"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            className="form-control mb-3"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-success w-100"
          >
            Create Account
          </button>
        </form>

        <button
          className="btn btn-outline-primary w-100 mt-3"
          onClick={() => navigate("/login")}
        >
          Back To Login
        </button>
      </div>
    </div>
  );
}

export default Signup;