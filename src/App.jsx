import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./App.css";

import RoleSelect from "./pages/RoleSelect";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Rooms from "./pages/Rooms";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManageRooms from "./pages/ManageRooms";
import RoomAvailability from "./pages/RoomAvailability";
import AdminCalendar from "./pages/AdminCalendar";
import WriteFeedback from "./pages/WriteFeedback";
import ManageFeedbacks from "./pages/ManageFeedbacks";

function App() {
  return (
    <Router>
      <NavBar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-rooms" element={<ManageRooms />} />
          <Route path="/room-availability" element={<RoomAvailability />} />
          <Route path="/admin-calendar" element={<AdminCalendar />} />
          <Route path="/write-feedback" element={<WriteFeedback />} />
          <Route path="/manage-feedbacks" element={<ManageFeedbacks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;