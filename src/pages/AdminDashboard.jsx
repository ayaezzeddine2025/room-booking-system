import "./AdminDashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [totalFloors, setTotalFloors] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [bookedRooms, setBookedRooms] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const floorsResponse = await axios.get("https://room-booking-backend-production-7a12.up.railway.app/floors");
      const roomsResponse = await axios.get("https://room-booking-backend-production-7a12.up.railway.app/rooms");

      if (floorsResponse.data.success) {
        setTotalFloors(floorsResponse.data.data.length);
      }

      if (roomsResponse.data.success) {
        const rooms = roomsResponse.data.data;

        setTotalRooms(rooms.length);

        setAvailableRooms(
          rooms.filter((room) => room.calculated_status === "available").length
        );

        setBookedRooms(
          rooms.filter((room) => room.calculated_status === "booked").length
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>
          Manage rooms, view room availability, and monitor the system from one place.
        </p>
      </div>

      <div className="admin-cards">
        <div className="admin-card">
          <h2>Manage Rooms</h2>
          <p>Add, edit, and organize rooms based on floors and room details.</p>
          <Link to="/manage-rooms" className="admin-btn">
            Open Rooms
          </Link>
        </div>

        <div className="admin-card">
          <h2>Room Availability</h2>
          <p>View all rooms and check whether each room is available or booked.</p>
          <Link to="/room-availability" className="admin-btn">
            Open Availability
          </Link>
        </div>
      </div>

      <div className="admin-summary">
        <div className="admin-summary-box">
          <h3>{totalFloors}</h3>
          <p>Total Floors</p>
        </div>

        <div className="admin-summary-box">
          <h3>{totalRooms}</h3>
          <p>Total Rooms</p>
        </div>

        <div className="admin-summary-box">
          <h3>{availableRooms}</h3>
          <p>Available Rooms</p>
        </div>

        <div className="admin-summary-box">
          <h3>{bookedRooms}</h3>
          <p>Booked Rooms</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;