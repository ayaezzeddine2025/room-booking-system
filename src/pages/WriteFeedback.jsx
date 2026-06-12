import "./WriteFeedback.css";
import { useEffect, useState } from "react";
import axios from "axios";

function WriteFeedback() {
  const [studentData, setStudentData] = useState(null);
  const [approvedRooms, setApprovedRooms] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const savedStudent = localStorage.getItem("studentData");

    if (savedStudent) {
      const parsedStudent = JSON.parse(savedStudent);
      setStudentData(parsedStudent);
      fetchApprovedRooms(parsedStudent.student_id);
    }
  }, []);

  const fetchApprovedRooms = async (studentId) => {
    try {
      const response = await axios.get(
        `https://room-booking-backend-production-7a12.up.railway.app/feedbacks/student-approved-rooms/${studentId}`
      );

      if (response.data.success) {
        setApprovedRooms(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (!studentData) {
      alert("Student data not found");
      return;
    }

    if (!bookingId || !feedbackText) {
      alert("Please select a room and write your feedback");
      return;
    }

    try {
      const response = await axios.post("https://room-booking-backend-production-7a12.up.railway.app/feedbacks", {
        booking_id: bookingId,
        feedback_text: feedbackText,
      });

      if (response.data.success) {
        alert(response.data.message);
        setBookingId("");
        setFeedbackText("");
        fetchApprovedRooms(studentData.student_id);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to submit feedback");
    }
  };

  return (
    <div className="write-feedback-page">
      <div className="write-feedback-header">
        <h1>Write Feedback</h1>
        <p>Write feedback only for rooms booked.</p>
      </div>

      <div className="write-feedback-box">
        <h2>Room Feedback</h2>

        <form className="write-feedback-form" onSubmit={handleSubmitFeedback}>
          <div className="form-group">
            <label>Select booking Room</label>
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            >
              <option value="">Select room</option>
              {approvedRooms.map((room) => (
                <option key={room.booking_id} value={room.booking_id}>
                  Room {room.room_number} - {room.room_type} - Floor{" "}
                  {room.floor_number} - {room.floor_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Your Feedback</label>
            <textarea
              placeholder="Write your feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="feedback-submit-btn">
            Submit Feedback
          </button>
        </form>

        {approvedRooms.length === 0 && (
          <p className="no-feedback-text">
            You do not have booked rooms yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default WriteFeedback;