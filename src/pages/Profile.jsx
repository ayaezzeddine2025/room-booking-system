import "./Profile.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Profile() {
  const fileInputRef = useRef(null);

  const [studentData, setStudentData] = useState({
    student_id: "",
    full_name: "",
    username: "",
    email: "",
    phone: "",
    profile_image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem("studentData");

    if (savedStudent) {
      const parsedStudent = JSON.parse(savedStudent);
      setStudentData(parsedStudent);
    }
  }, []);

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `https://room-booking-backend-production-7a12.up.railway.app/students/${studentData.student_id}`,
        {
          full_name: studentData.full_name,
          username: studentData.username,
          email: studentData.email,
          phone: studentData.phone,
        }
      );

      if (response.data.success) {
        let updatedStudent = response.data.user;

        if (selectedImage) {
          const imageData = new FormData();
          imageData.append("profile_image", selectedImage);

          const imageResponse = await axios.post(
            `https://room-booking-backend-production-7a12.up.railway.app/students/${studentData.student_id}/profile-image`,
            imageData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (imageResponse.data.success) {
            updatedStudent = imageResponse.data.user;
          }
        }

        localStorage.setItem("studentData", JSON.stringify(updatedStudent));
        setStudentData(updatedStudent);
        setIsEditing(false);
        setSelectedImage(null);

        alert("Profile updated successfully");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    }
  };

  const firstLetter = studentData.full_name
    ? studentData.full_name.charAt(0).toUpperCase()
    : "S";

  const imageUrl = selectedImage
    ? URL.createObjectURL(selectedImage)
    : studentData.profile_image
    ? `https://room-booking-backend-production-7a12.up.railway.app/${studentData.profile_image}`
    : "";

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile Page</h1>
        <p>View and update your personal information and account details.</p>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div
            className={isEditing ? "profile-avatar clickable-avatar" : "profile-avatar"}
            onClick={handleAvatarClick}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Profile" className="profile-image" />
            ) : (
              <div className="avatar-circle">{firstLetter}</div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {isEditing && (
            <p className="profile-image-note">
              Click the profile picture to change it.
            </p>
          )}

          <form className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={studentData.full_name || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={studentData.username || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={studentData.email || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                value={studentData.phone || ""}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            {!isEditing ? (
              <button
                type="button"
                className="profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="profile-btn"
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;