import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { useState } from "react";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "https://room-booking-backend-production-7a12.up.railway.app/students/register",
        {
          full_name: formData.full_name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("userRole", "student");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("studentData", JSON.stringify(response.data.user));

        alert(response.data.message);
        navigate("/home");
      } else {
        alert(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <h1>Create Your Account</h1>
          <p>
            Register to start booking rooms, manage your reservations, and use
            the Room Booking Management System in a simple and clear way.
          </p>
        </div>

        <div className="register-right">
          <h2>Register</h2>

          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

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
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
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

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;