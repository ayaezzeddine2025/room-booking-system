import "./ManageRooms.css";
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

function ManageRooms() {
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState("");
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [roomFormData, setRoomFormData] = useState({
    floor_id: "",
    room_type: "",
    capacity: "",
    day_price: "",
    week_price: "",
    month_price: "",
    status: "available",
    room_image: "",
  });

  const [editFormData, setEditFormData] = useState({
    room_type: "",
    capacity: "",
    day_price: "",
    week_price: "",
    month_price: "",
    status: "available",
    room_image: "",
  });

  useEffect(() => {
    fetchFloors();
    fetchRooms();
  }, []);

  const fetchFloors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/floors");

      if (response.data.success) {
        setFloors(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleFloorChange = (e) => {
    const value = e.target.value;

    setSelectedFloor(value);
    setRoomFormData({
      ...roomFormData,
      floor_id: value,
    });

    setEditingRoomId(null);
    setShowAddRoomForm(false);
  };

  const handleRoomChange = (e) => {
    setRoomFormData({
      ...roomFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFloor = async () => {
    try {
      const response = await axios.post("http://localhost:5000/floors", {});

      if (response.data.success) {
        alert(response.data.message);
        fetchFloors();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add floor");
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/rooms", {
        floor_id: roomFormData.floor_id,
        room_type: roomFormData.room_type,
        capacity: roomFormData.capacity,
        day_price: roomFormData.day_price,
        week_price: roomFormData.week_price,
        month_price: roomFormData.month_price,
        status: roomFormData.status,
        room_image: cleanImageName(roomFormData.room_image),
      });

      if (response.data.success) {
        alert(response.data.message);

        setRoomFormData({
          floor_id: selectedFloor || "",
          room_type: "",
          capacity: "",
          day_price: "",
          week_price: "",
          month_price: "",
          status: "available",
          room_image: "",
        });

        setShowAddRoomForm(false);
        fetchRooms();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add room");
    }
  };

  const handleEditRoom = (room) => {
    setShowAddRoomForm(false);
    setEditingRoomId(room.room_id);

    setEditFormData({
      room_type: room.room_type || "",
      capacity: room.capacity || "",
      day_price: room.day_price || room.price || "",
      week_price: room.week_price || "",
      month_price: room.month_price || "",
      status: room.calculated_status || "available",
      room_image: cleanImageName(room.room_image),
    });
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);

    setEditFormData({
      room_type: "",
      capacity: "",
      day_price: "",
      week_price: "",
      month_price: "",
      status: "available",
      room_image: "",
    });
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/rooms/${editingRoomId}`,
        {
          room_type: editFormData.room_type,
          capacity: editFormData.capacity,
          day_price: editFormData.day_price,
          week_price: editFormData.week_price,
          month_price: editFormData.month_price,
          status: editFormData.status,
          room_image: cleanImageName(editFormData.room_image),
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        setEditingRoomId(null);
        fetchRooms();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update room");
    }
  };

  const filteredRooms = selectedFloor
    ? rooms.filter((room) => String(room.floor_id) === String(selectedFloor))
    : [];

  return (
    <div className="manage-rooms-page">
      <div className="manage-rooms-header">
        <h1>Manage Rooms</h1>
        <p>Add and manage room details based on floors.</p>
      </div>

      <div className="floor-actions-row">
        <div className="floor-select-box">
          <label>Select Floor</label>
          <select value={selectedFloor} onChange={handleFloorChange}>
            <option value="">Select a floor</option>
            {floors.map((floor) => (
              <option key={floor.floor_id} value={floor.floor_id}>
                Floor {floor.floor_number} - {floor.floor_name}
              </option>
            ))}
          </select>
        </div>

        <div className="add-floor-small-box">
          <button
            type="button"
            className="room-submit-btn"
            onClick={handleAddFloor}
          >
            Add New Floor
          </button>
        </div>
      </div>

      {selectedFloor && (
        <>
          <div className="rooms-cards-section">
            {filteredRooms.map((room) => {
              const imageSrc = getRoomImage(room.room_image);
              const editImageSrc = getRoomImage(editFormData.room_image);

              return (
                <div className="room-display-card" key={room.room_id}>
                  {editingRoomId === room.room_id ? (
                    <form
                      className="edit-room-card-form"
                      onSubmit={handleUpdateRoom}
                    >
                      <h3>Edit Room {room.room_number}</h3>

                      {editImageSrc ? (
                        <img
                          src={editImageSrc}
                          alt={`Room ${room.room_number}`}
                          className="manage-room-card-image"
                        />
                      ) : (
                        <div className="missing-room-image">
                          No image
                          {editFormData.room_image && (
                            <span>{editFormData.room_image}</span>
                          )}
                        </div>
                      )}

                      <div className="form-group full-width">
                        <label>Room Type</label>
                        <select
                          name="room_type"
                          value={editFormData.room_type}
                          onChange={handleEditChange}
                        >
                          <option value="">Select room type</option>
                          <option value="Single Room">Single Room</option>
                          <option value="Double Room">Double Room</option>
                          <option value="Triple Room">Triple Room</option>
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label>Capacity</label>
                        <input
                          type="number"
                          name="capacity"
                          value={editFormData.capacity}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Day Price</label>
                        <input
                          type="number"
                          name="day_price"
                          value={editFormData.day_price}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Week Price</label>
                        <input
                          type="number"
                          name="week_price"
                          value={editFormData.week_price}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Month Price</label>
                        <input
                          type="number"
                          name="month_price"
                          value={editFormData.month_price}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Room Image</label>
                        <input
                          type="text"
                          name="room_image"
                          placeholder="Example: room101.jpg"
                          value={editFormData.room_image}
                          onChange={handleEditChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Status</label>
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleEditChange}
                        >
                          <option value="available">Available</option>
                          <option value="booked">Booked</option>
                        </select>
                      </div>

                      <div className="form-buttons-row">
                        <button type="submit" className="room-submit-btn">
                          Save Changes
                        </button>

                        <button
                          type="button"
                          className="room-cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={`Room ${room.room_number}`}
                          className="manage-room-card-image"
                        />
                      ) : (
                        <div className="missing-room-image">
                          No image
                          {room.room_image && <span>{room.room_image}</span>}
                        </div>
                      )}

                      <h3>Room {room.room_number}</h3>

                      <p>
                        <strong>Type:</strong> {room.room_type}
                      </p>

                      <p>
                        <strong>Capacity:</strong> {room.capacity}
                      </p>

                      <p>
                        <strong>Day Price:</strong> ${room.day_price}
                      </p>

                      <p>
                        <strong>Week Price:</strong> ${room.week_price}
                      </p>

                      <p>
                        <strong>Month Price:</strong> ${room.month_price}
                      </p>

                      <p>
                        <strong>Bookings Count:</strong> {room.booking_count}
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
                        className="room-submit-btn"
                        onClick={() => handleEditRoom(room)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              );
            })}

            <div
              className="add-room-card"
              onClick={() => {
                setShowAddRoomForm(!showAddRoomForm);
                setEditingRoomId(null);
              }}
            >
              <div className="add-room-plus">+</div>
              <p>Add Room</p>
            </div>
          </div>

          {showAddRoomForm && (
            <div className="add-room-box">
              <h2>Add New Room</h2>

              <form className="add-room-form" onSubmit={handleAddRoom}>
                <div className="form-group">
                  <label>Floor</label>
                  <select
                    name="floor_id"
                    value={roomFormData.floor_id}
                    onChange={handleRoomChange}
                  >
                    <option value="">Select floor</option>
                    {floors.map((floor) => (
                      <option key={floor.floor_id} value={floor.floor_id}>
                        Floor {floor.floor_number} - {floor.floor_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    name="room_type"
                    value={roomFormData.room_type}
                    onChange={handleRoomChange}
                  >
                    <option value="">Select room type</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Double Room">Double Room</option>
                    <option value="Triple Room">Triple Room</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Enter capacity"
                    value={roomFormData.capacity}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>Day Price</label>
                  <input
                    type="number"
                    name="day_price"
                    placeholder="Enter day price"
                    value={roomFormData.day_price}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>Week Price</label>
                  <input
                    type="number"
                    name="week_price"
                    placeholder="Enter week price"
                    value={roomFormData.week_price}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>Month Price</label>
                  <input
                    type="number"
                    name="month_price"
                    placeholder="Enter month price"
                    value={roomFormData.month_price}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>Room Image</label>
                  <input
                    type="text"
                    name="room_image"
                    placeholder="Example: room101.jpg"
                    value={roomFormData.room_image}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Status</label>
                  <select
                    name="status"
                    value={roomFormData.status}
                    onChange={handleRoomChange}
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                <button type="submit" className="room-submit-btn">
                  Add Room
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManageRooms;