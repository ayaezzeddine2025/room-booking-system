import "./RoomAvailability.css";
import { useEffect, useState } from "react";
import axios from "axios";

const roomAssets = require.context("../assets", false, /\.(png|jpe?g|webp)$/);

function cleanImageName(imageName) {
  if (!imageName) return "";

  return String(imageName).trim().split("/").pop().split("\\").pop();
}

function getRoomImage(imageName) {
  const cleanName = cleanImageName(imageName);

  if (!cleanName) return null;

  try {
    return roomAssets(`./${cleanName}`);
  } catch {
    return null;
  }
}

function RoomAvailability() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/rooms");

      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="room-availability-page">
      <div className="room-availability-header">
        <h1>Room Availability</h1>
        <p>View all rooms and check whether each room is available or booked.</p>
      </div>

      <div className="room-availability-table-box">
        <h2>Rooms Status</h2>

        <div className="room-availability-table-wrapper">
          <table className="room-availability-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Floor</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Capacity</th>
                <th>Day Price</th>
                <th>Week Price</th>
                <th>Month Price</th>
                <th>Bookings Count</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  const imageSrc = getRoomImage(room.room_image);

                  return (
                    <tr key={room.room_id}>
                      <td>
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={`Room ${room.room_number}`}
                            className="availability-room-image"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>

                      <td>
                        Floor {room.floor_number} - {room.floor_name}
                      </td>

                      <td>{room.room_number}</td>
                      <td>{room.room_type}</td>
                      <td>{room.capacity}</td>
                      <td>${room.day_price}</td>
                      <td>${room.week_price}</td>
                      <td>${room.month_price}</td>
                      <td>{room.booking_count}</td>

                      <td>
                        <span
                          className={
                            room.calculated_status === "available"
                              ? "availability-status available"
                              : "availability-status booked"
                          }
                        >
                          {room.calculated_status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="empty-availability-row">
                    No rooms found.
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

export default RoomAvailability;