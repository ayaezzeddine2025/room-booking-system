import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useEffect, useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (role === "admin") {
        response = await axios.post("https://room-booking-backend-production-7a12.up.railway.app/admins/login", {
          username: formData.username,
          password: formData.password,
        });
      } else if (role === "student") {
        response = await axios.post("https://room-booking-backend-production-7a12.up.railway.app/students/login", {
          username: formData.username,
          password: formData.password,
        });
      } else {
        alert("Please select a role first");
        return;
      }

      if (response.data.success) {
        localStorage.setItem("userRole", role);
        localStorage.setItem("isLoggedIn", "true");

        if (role === "admin") {
          localStorage.setItem("adminData", JSON.stringify(response.data.admin));
          navigate("/admin-dashboard");
        } else {
          localStorage.setItem("studentData", JSON.stringify(response.data.user));
          navigate("/home");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1>{role === "admin" ? "Admin Login" : "Student Login"}</h1>
          <p>
            {role === "admin"
              ? "Login as admin to manage rooms, bookings, and system data."
              : "Login as student to view rooms, bookings, and your profile."}
          </p>
        </div>

        <div className="login-right">
          <h2>Login</h2>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          {role === "student" && (
            <p className="login-footer">
              Don’t have an account? <Link to="/register">Create a new account</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;