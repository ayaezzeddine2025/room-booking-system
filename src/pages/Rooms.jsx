import "./Rooms.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import room101 from "../assets/room101.jpg";
import room102 from "../assets/room102.jpg";
import room103 from "../assets/room103.jpg";
import room104 from "../assets/room104.jpg";
import room105 from "../assets/room105.jpg";
import room106 from "../assets/room106.jpg";
import room107 from "../assets/room107.jpg";
import room108 from "../assets/room108.jpg";
import room109 from "../assets/room109.jpg";
import room110 from "../assets/room110.jpg";

import room201 from "../assets/room201.jpg";
import room202 from "../assets/room202.jpg";
import room203 from "../assets/room203.jpg";
import room204 from "../assets/room204.jpg";
import room205 from "../assets/room205.jpg";
import room206 from "../assets/room206.jpg";
import room207 from "../assets/room207.jpg";
import room208 from "../assets/room208.jpg";
import room209 from "../assets/room209.jpg";
import room210 from "../assets/room210.jpg";

const roomImages = {
  "room101.jpg": room101,
  "room102.jpg": room102,
  "room103.jpg": room103,
  "room104.jpg": room104,
  "room105.jpg": room105,
  "room106.jpg": room106,
  "room107.jpg": room107,
  "room108.jpg": room108,
  "room109.jpg": room109,
  "room110.jpg": room110,

  "room201.jpg": room201,
  "room202.jpg": room202,
  "room203.jpg": room203,
  "room204.jpg": room204,
  "room205.jpg": room205,
  "room206.jpg": room206,
  "room207.jpg": room207,
  "room208.jpg": room208,
  "room209.jpg": room209,
  "room210.jpg": room210,
};

function Rooms() {
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://room-booking-backend-production-7a12.up.railway.app/floors")
      .then((response) => {
        if (response.data.success) {
          setFloors(response.data.data);
        }
      })
      .catch((error) => {
        console.log("Floors error:", error);
      });

    axios
      .get("https://room-booking-backend-production-7a12.up.railway.app/rooms")
      .then((response) => {
        if (response.data.success) {
          setRooms(response.data.data);
        }
      })
      .catch((error) => {
        console.log("Rooms error:", error);
      });
  }, []);

  const handleFloorChange = (e) => {
    setSelectedFloor(e.target.value);
  };

  const handleSelectRoom = (room) => {
    if (room.calculated_status === "booked") {
      alert("This room is fully booked. You cannot select it.");
      return;
    }

    localStorage.setItem("selectedRoom", JSON.stringify(room));
    navigate("/my-bookings");
  };

  const filteredRooms = selectedFloor
    ? rooms.filter((room) => String(room.floor_id) === String(selectedFloor))
    : [];

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Rooms Page</h1>
        <p>Select a floor, then choose a room.</p>
      </div>

      <div className="floor-select-box">
        <label htmlFor="floorSelect">Choose Floor</label>
        <select
          id="floorSelect"
          value={selectedFloor}
          onChange={handleFloorChange}
        >
          <option value="">Select floor</option>
          {floors.map((floor) => (
            <option key={floor.floor_id} value={floor.floor_id}>
              Floor {floor.floor_number} - {floor.floor_name}
            </option>
          ))}
        </select>
      </div>

      {selectedFloor && (
        <div className="rooms-grid">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div className="room-card" key={room.room_id}>
                {room.room_image && roomImages[room.room_image] && (
                  <img
                    src={roomImages[room.room_image]}
                    alt={`Room ${room.room_number}`}
                    className="room-image"
                  />
                )}

                <h2>Room {room.room_number}</h2>

                <p>
                  <strong>Floor:</strong> {room.floor_name}
                </p>

                <p>
                  <strong>Type:</strong> {room.room_type}
                </p>

                <p>
                  <strong>Capacity:</strong> {room.capacity}
                </p>

                <p>
                  <strong>Bookings Count:</strong> {room.booking_count}
                </p>

                <p>
                  <strong>Day Price:</strong> ${room.day_price || room.price}
                </p>

                <p>
                  <strong>Week Price:</strong> ${room.week_price}
                </p>

                <p>
                  <strong>Month Price:</strong> ${room.month_price}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      room.calculated_status === "available"
                        ? "room-status available"
                        : "room-status booked"
                    }
                  >
                    {room.calculated_status}
                  </span>
                </p>

                <button
                  type="button"
                  className="room-btn"
                  onClick={() => handleSelectRoom(room)}
                  disabled={room.calculated_status === "booked"}
                >
                  {room.calculated_status === "booked"
                    ? "Fully Booked"
                    : "Select Room"}
                </button>
              </div>
            ))
          ) : (
            <div className="room-card">
              <h2>No Rooms Found</h2>
              <p>There are no rooms in this floor right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Rooms;