import "./ManageFeedbacks.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/feedbacks");

      if (response.data.success) {
        setFeedbacks(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    return String(dateValue).split("T")[0];
  };

  const getAnalysisClass = (analysis) => {
    if (!analysis) return "neutral";
    return analysis.toLowerCase();
  };

  return (
    <div className="manage-feedbacks-page">
      <div className="manage-feedbacks-header">
        <h1>Manage Feedbacks</h1>
      </div>

      <div className="manage-feedbacks-table-box">
        <h2>Student Feedbacks</h2>

        <div className="manage-feedbacks-table-wrapper">
          <table className="manage-feedbacks-table">
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Student Name</th>
                <th>Username</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Floor</th>
                <th>Feedback</th>
                <th>AI Analysis</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <tr key={feedback.feedback_id}>
                    <td>{feedback.feedback_id}</td>
                    <td>{feedback.full_name}</td>
                    <td>{feedback.username}</td>
                    <td>{feedback.room_number}</td>
                    <td>{feedback.room_type}</td>
                    <td>
                      Floor {feedback.floor_number} - {feedback.floor_name}
                    </td>
                    <td>{feedback.feedback_text}</td>
                    <td>
                      <span
                        className={`ai-analysis ${getAnalysisClass(
                          feedback.ai_analysis
                        )}`}
                      >
                        {feedback.ai_analysis || "Neutral"}
                      </span>
                    </td>
                    <td>{formatDate(feedback.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-feedback-row">
                    No feedbacks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageFeedbacks;