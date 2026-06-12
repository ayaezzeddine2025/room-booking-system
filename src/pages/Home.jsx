import "./Home.css";
import { Link } from "react-router-dom";
import homeBg from "../assets/home.jpg";

function Home() {
  return (
    <div className="home">
      <section
        className="hero"
        style={{ "--home-bg": `url(${homeBg})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">Smart Room Booking Platform</span>

            <h1>Book Rooms Easily and Manage Reservations Efficiently</h1>

            <p>
              Room Booking Management System helps students and administrators
              handle room reservations in a simple, organized, and modern way.
            </p>

            <div className="hero-buttons">
              <Link to="/student-dashboard" className="btn primary-btn">
                Get Started
              </Link>
              <Link to="/about" className="btn secondary-btn">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-header">
          <h2>Why Choose Our System?</h2>
          <p>
            A modern booking solution designed to save time, reduce errors, and
            improve room management.
          </p>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="icon-circle">📅</div>
            <h3>Easy Booking</h3>
            <p>
              Students can browse available rooms and submit booking requests
              quickly.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">📋</div>
            <h3>Booking Tracking</h3>
            <p>
              Users can check booking details, status, and reservation history
              anytime.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-circle">⚙️</div>
            <h3>Admin Management</h3>
            <p>
              Administrators can manage rooms, bookings, and the whole system
              easily.
            </p>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-box">
          <h3>100+</h3>
          <p>Available Rooms</p>
        </div>

        <div className="stat-box">
          <h3>500+</h3>
          <p>Successful Bookings</p>
        </div>

        <div className="stat-box">
          <h3>24/7</h3>
          <p>Easy Access</p>
        </div>
      </section>
    </div>
  );
}

export default Home;