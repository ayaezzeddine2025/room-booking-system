import "./RoleSelect.css";
import { useNavigate } from "react-router-dom";
import adminImage from "../assets/admin.jpg";
import studentImage from "../assets/student.jpg";

function RoleSelect() {
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate("/login");
  };

  return (
    <div className="role-select-page">
      <div className="role-select-container">
        <h1 className="role-title">Choose Your Role</h1>
        <p className="role-subtitle">Select how you want to continue</p>

        <div className="role-cards">
          <div className="role-card" onClick={() => handleSelectRole("admin")}>
            <img src={adminImage} alt="Admin" className="role-image" />
            <h2>Admin</h2>
          </div>

          <div className="role-card" onClick={() => handleSelectRole("student")}>
            <img src={studentImage} alt="Student" className="role-image" />
            <h2>Student</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;