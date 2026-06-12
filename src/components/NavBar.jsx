import "./NavBar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedLogin = localStorage.getItem("isLoggedIn");

    setUserRole(savedRole || "");
    setIsLoggedIn(savedLogin === "true");
    setIsOpen(false);
  }, [location.pathname]);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("selectedRole");
    localStorage.removeItem("studentData");
    localStorage.removeItem("adminData");
    localStorage.removeItem("selectedRoom");

    setUserRole("");
    setIsLoggedIn(false);
    setIsOpen(false);

    navigate("/");
  };

  const isChooseRolePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const selectedRole = localStorage.getItem("selectedRole");

  const isAdminLoginPage = isLoginPage && selectedRole === "admin";
  const isStudentLoginPage = isLoginPage && selectedRole === "student";

  const isProfilePage = location.pathname === "/profile";
  const isRoomsPage = location.pathname === "/rooms";
  const isMyBookingsPage = location.pathname === "/my-bookings";
  const isManageRoomsPage = location.pathname === "/manage-rooms";
  const isRoomAvailabilityPage = location.pathname === "/room-availability";

  if (isChooseRolePage) {
    return null;
  }

  const showArrow =
    isAdminLoginPage ||
    isStudentLoginPage ||
    isRegisterPage ||
    isProfilePage ||
    isRoomsPage ||
    isMyBookingsPage ||
    isManageRoomsPage ||
    isRoomAvailabilityPage;

  const handleBackArrow = () => {
    if (isAdminLoginPage || isStudentLoginPage || isRegisterPage) {
      navigate("/");
    } else if (isManageRoomsPage || isRoomAvailabilityPage) {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  const showStudentNavbar =
    isStudentLoginPage ||
    isRegisterPage ||
    (isLoggedIn && userRole === "student");

  const showAdminNavbar = isLoggedIn && userRole === "admin";

  return (
    <>
      {showArrow ? (
        <button
          className="menu-toggle back-arrow-btn"
          onClick={handleBackArrow}
        >
          ←
        </button>
      ) : (
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      )}

      {(showStudentNavbar || showAdminNavbar) && (
        <div className={`sidebar ${isOpen ? "show" : ""}`}>
          <div className="sidebar-logo">
            <h2>Room Booking</h2>
            <p>Management System</p>
          </div>

          {showAdminNavbar && (
            <div className="sidebar-section">
              <h4>Admin</h4>

              <Link to="/admin-dashboard" onClick={closeSidebar}>
                Dashboard
              </Link>

              <Link to="/manage-feedbacks" onClick={closeSidebar}>
                Manage Feedbacks
              </Link>

              <Link to="/admin-calendar" onClick={closeSidebar}>
                Booking Calendar
              </Link>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          {showStudentNavbar && (
            <div className="sidebar-section">
              <h4>Student</h4>

              <Link to="/home" onClick={closeSidebar}>
                Home
              </Link>

              <Link to="/student-dashboard" onClick={closeSidebar}>
                Dashboard
              </Link>

              <Link to="/profile" onClick={closeSidebar}>
                Profile
              </Link>

              <Link to="/write-feedback" onClick={closeSidebar}>
                Write Feedback
              </Link>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
}

export default NavBar;