import "./StudentDashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const savedStudent = localStorage.getItem("studentData");

    if (savedStudent) {
      const parsedStudent = JSON.parse(savedStudent);
      setStudentData(parsedStudent);
    }
  }, []);

  useEffect(() => {
    if (studentData?.student_id) {
      axios
        .get(
          `https://room-booking-backend-production-7a12.up.railway.app/bookings/student/${studentData.student_id}`
        )
        .then((response) => {
          if (response.data.success) {
            const bookings = response.data.data;
            setTotalBookings(bookings.length);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [studentData]);

  const handleSeeBookings = () => {
    localStorage.removeItem("selectedRoom");
  };

  const fullName = studentData?.full_name || "Student";
  const firstLetter = fullName.charAt(0).toUpperCase();

  const profileImageUrl = studentData?.profile_image
    ? `https://room-booking-backend-production-7a12.up.railway.app/${studentData.profile_image}`
    : "";

  return (
    <div className="student-dashboard">
      <div className="student-welcome-card">
        <div className="student-welcome-text">
          <h1>Welcome back, {fullName}</h1>
          <p>
            Manage your room bookings, profile, and feedback from one place.
          </p>
        </div>

        <Link to="/profile" className="student-profile-circle">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="student-profile-image"
            />
          ) : (
            firstLetter
          )}
        </Link>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Available Rooms</h2>
          <p>View all rooms that are ready for booking.</p>
          <Link to="/rooms" className="dashboard-btn">
            View Rooms
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>My Bookings</h2>
          <p>Check your booking history and current reservation status.</p>
          <Link
            to="/my-bookings"
            className="dashboard-btn"
            onClick={handleSeeBookings}
          >
            See Bookings
          </Link>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-box">
          <h3>{totalBookings}</h3>
          <p>Total Bookings</p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;