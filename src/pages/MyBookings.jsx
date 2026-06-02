import "./MyBookings.css";
import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [studentData, setStudentData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [bookingDuration, setBookingDuration] = useState("day");
  const [bookingDate, setBookingDate] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNumber, setPaymentNumber] = useState("");

  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getTodayDate();

  useEffect(() => {
    const savedStudent = localStorage.getItem("studentData");
    const savedRoom = localStorage.getItem("selectedRoom");

    if (savedStudent) {
      setStudentData(JSON.parse(savedStudent));
    }

    if (savedRoom) {
      const parsedRoom = JSON.parse(savedRoom);
      setSelectedRoom(parsedRoom);
      setPeopleCount(1);
    }
  }, []);

  useEffect(() => {
    if (paymentMethod === "cash") {
      setPaymentNumber("");
    }
  }, [paymentMethod]);

  const fetchBookings = async (studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/bookings/student/${studentId}`
      );

      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (studentData?.student_id) {
      fetchBookings(studentData.student_id);
    }
  }, [studentData]);

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const addDays = (dateValue, days) => {
    const date = new Date(`${dateValue}T00:00:00`);
    date.setDate(date.getDate() + days);
    return formatDateForInput(date);
  };

  const addMonth = (dateValue) => {
    const date = new Date(`${dateValue}T00:00:00`);
    date.setMonth(date.getMonth() + 1);
    return formatDateForInput(date);
  };

  const calculateEndDate = () => {
    if (!bookingDate) return "";

    if (bookingDuration === "day") {
      return bookingDate;
    }

    if (bookingDuration === "week") {
      return addDays(bookingDate, 7);
    }

    if (bookingDuration === "month") {
      return addMonth(bookingDate);
    }

    return bookingDate;
  };

  const getRoomPriceByDuration = () => {
    if (!selectedRoom) return 0;

    if (bookingDuration === "day") {
      return Number(selectedRoom.day_price || selectedRoom.price || 0);
    }

    if (bookingDuration === "week") {
      return Number(selectedRoom.week_price || 0);
    }

    if (bookingDuration === "month") {
      return Number(selectedRoom.month_price || 0);
    }

    return 0;
  };

  const getPricePerPerson = () => {
    const totalPrice = getRoomPriceByDuration();

    if (!totalPrice || !peopleCount) {
      return 0;
    }

    return Number((totalPrice / Number(peopleCount)).toFixed(2));
  };

  const getPeopleOptions = () => {
    const capacity = Number(selectedRoom?.capacity || 1);

    if (capacity >= 3) {
      return [
        { value: 1, label: "Only me" },
        { value: 2, label: "Me and one person" },
        { value: 3, label: "Me and two persons" },
      ];
    }

    if (capacity === 2) {
      return [
        { value: 1, label: "Only me" },
        { value: 2, label: "Me and one person" },
      ];
    }

    return [{ value: 1, label: "Only me" }];
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "";
    return String(dateValue).split("T")[0];
  };

  const formatDuration = (duration) => {
    if (duration === "day") return "One Day";
    if (duration === "week") return "One Week";
    if (duration === "month") return "One Month";
    return duration;
  };

  const handleAddBooking = async () => {
    if (!studentData || !selectedRoom) {
      alert("No student or room selected");
      return;
    }

    if (!bookingDuration || !bookingDate) {
      alert("Please select booking duration and date");
      return;
    }

    if (bookingDate < today) {
      alert("You cannot book a previous date");
      return;
    }

    if (!peopleCount) {
      alert("Please select number of people");
      return;
    }

    if ((paymentMethod === "wish" || paymentMethod === "omt") && !paymentNumber) {
      alert("Please enter payment number");
      return;
    }

    const startDate = bookingDate;
    const endDate = calculateEndDate();

    try {
      const response = await axios.post("http://localhost:5000/bookings", {
        student_id: studentData.student_id,
        room_id: selectedRoom.room_id,
        start_date: startDate,
        end_date: endDate,
        booking_duration: bookingDuration,
        people_count: peopleCount,
        payment_method: paymentMethod,
        payment_number: paymentMethod === "cash" ? null : paymentNumber,
        notes: null,
      });

      if (response.data.success) {
        alert(response.data.message);

        localStorage.removeItem("selectedRoom");

        await fetchBookings(studentData.student_id);

        setSelectedRoom(null);
        setBookingDuration("day");
        setBookingDate("");
        setPeopleCount(1);
        setPaymentMethod("cash");
        setPaymentNumber("");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to add booking");
    }
  };

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-header">
        <h1>My Bookings</h1>
        <p>
          {selectedRoom
            ? "Add a new booking for the selected room."
            : "View your room bookings."}
        </p>
      </div>

      {selectedRoom ? (
        <div className="bookings-table-wrapper selected-room-card">
          <h2>Selected Room</h2>

          <p>
            <strong>Room Number:</strong> {selectedRoom.room_number}
          </p>

          <p>
            <strong>Floor:</strong> {selectedRoom.floor_name}
          </p>

          <p>
            <strong>Type:</strong> {selectedRoom.room_type}
          </p>

          <p>
            <strong>Capacity:</strong> {selectedRoom.capacity}
          </p>

          <p>
            <strong>Day Price:</strong> ${selectedRoom.day_price || selectedRoom.price}
          </p>

          <p>
            <strong>Week Price:</strong> ${selectedRoom.week_price}
          </p>

          <p>
            <strong>Month Price:</strong> ${selectedRoom.month_price}
          </p>

          <div className="booking-form-box">
            <div className="form-group full-width">
              <label>Booking Duration</label>

              <div className="radio-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="bookingDuration"
                    value="day"
                    checked={bookingDuration === "day"}
                    onChange={(e) => setBookingDuration(e.target.value)}
                  />
                  One Day
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="bookingDuration"
                    value="week"
                    checked={bookingDuration === "week"}
                    onChange={(e) => setBookingDuration(e.target.value)}
                  />
                  One Week
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="bookingDuration"
                    value="month"
                    checked={bookingDuration === "month"}
                    onChange={(e) => setBookingDuration(e.target.value)}
                  />
                  One Month
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>
                {bookingDuration === "day"
                  ? "Choose Day"
                  : "Choose Start Date"}
              </label>

              <input
                type="date"
                min={today}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            {bookingDate && (
              <div className="booking-date-preview">
                <p>
                  <strong>Start Date:</strong> {bookingDate}
                </p>
                <p>
                  <strong>End Date:</strong> {calculateEndDate()}
                </p>
              </div>
            )}

            {Number(selectedRoom.capacity) > 1 && (
              <div className="form-group full-width">
                <label>Number of People</label>

                <div className="radio-options">
                  {getPeopleOptions().map((option) => (
                    <label className="radio-option" key={option.value}>
                      <input
                        type="radio"
                        name="peopleCount"
                        value={option.value}
                        checked={Number(peopleCount) === Number(option.value)}
                        onChange={(e) => setPeopleCount(Number(e.target.value))}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {Number(selectedRoom.capacity) === 1 && (
              <div className="single-person-note">
                <strong>People:</strong> Only me
              </div>
            )}

            <div className="price-preview-box">
              <p>
                <strong>Total Room Price:</strong> ${getRoomPriceByDuration()}
              </p>
              <p>
                <strong>People Count:</strong> {peopleCount}
              </p>
              <p>
                <strong>Price Per Person:</strong> ${getPricePerPerson()}
              </p>
            </div>

            <div className="form-group full-width">
              <label>Payment Method</label>

              <div className="radio-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wish"
                    checked={paymentMethod === "wish"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Wish
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="omt"
                    checked={paymentMethod === "omt"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  OMT
                </label>
              </div>
            </div>

            {(paymentMethod === "wish" || paymentMethod === "omt") && (
              <div className="form-group">
                <label>
                  {paymentMethod === "wish" ? "Wish Number" : "OMT Number"}
                </label>

                <input
                  type="text"
                  placeholder={
                    paymentMethod === "wish"
                      ? "Enter Wish number"
                      : "Enter OMT number"
                  }
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                />
              </div>
            )}

            <button className="profile-btn" onClick={handleAddBooking}>
              Confirm Booking
            </button>
          </div>
        </div>
      ) : (
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Floor</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>People</th>
                <th>Payment</th>
                <th>Total Price</th>
                <th>Price / Person</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.booking_id}</td>
                    <td>{booking.room_number}</td>
                    <td>{booking.room_type}</td>
                    <td>{booking.floor_name}</td>
                    <td>{formatDuration(booking.booking_duration)}</td>
                    <td>{formatDate(booking.start_date)}</td>
                    <td>{formatDate(booking.end_date)}</td>
                    <td>{booking.people_count}</td>
                    <td>
                      {booking.payment_method}
                      {booking.payment_number
                        ? ` - ${booking.payment_number}`
                        : ""}
                    </td>
                    <td>${booking.total_price}</td>
                    <td>${booking.price_per_person}</td>
                    <td>
                      <span className={`status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBookings;