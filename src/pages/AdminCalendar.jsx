import "./AdminCalendar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchCalendarBookings();
  }, []);

  const addOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const fetchCalendarBookings = async () => {
    try {
      const response = await axios.get("https://room-booking-backend-production-7a12.up.railway.app/bookings/calendar");

      if (response.data.success) {
        const calendarEvents = response.data.data.map((booking) => ({
          id: booking.booking_id,
          title: `Room ${booking.room_number} - ${booking.floor_name}`,
          start: booking.start_date,
          end: addOneDay(booking.end_date),
          allDay: true,
          extendedProps: {
            studentName: booking.full_name,
            username: booking.username,
            roomNumber: booking.room_number,
            roomType: booking.room_type,
            floorName: booking.floor_name,
            floorNumber: booking.floor_number,
            startDate: booking.start_date,
            endDate: booking.end_date,
            status: booking.status,
          },
        }));

        setEvents(calendarEvents);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEventClick = (info) => {
    setSelectedBooking(info.event.extendedProps);
  };

  return (
    <div className="admin-calendar-page">
      <div className="admin-calendar-header">
        <h1>Booking Calendar</h1>
        <p>View all approved room reservations by date.</p>
      </div>

      <div className="admin-calendar-container">
        <div className="calendar-box">
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={handleEventClick}
            height="auto"
          />
        </div>

        {selectedBooking && (
          <div className="booking-details-box">
            <h2>Booking Details</h2>

            <p>
              <strong>Student:</strong> {selectedBooking.studentName}
            </p>

            <p>
              <strong>Username:</strong> {selectedBooking.username}
            </p>

            <p>
              <strong>Room Number:</strong> {selectedBooking.roomNumber}
            </p>

            <p>
              <strong>Room Type:</strong> {selectedBooking.roomType}
            </p>

            <p>
              <strong>Floor:</strong> Floor {selectedBooking.floorNumber} -{" "}
              {selectedBooking.floorName}
            </p>

            <p>
              <strong>Start Date:</strong> {selectedBooking.startDate}
            </p>

            <p>
              <strong>End Date:</strong> {selectedBooking.endDate}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className="calendar-status approved">
                {selectedBooking.status}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCalendar;