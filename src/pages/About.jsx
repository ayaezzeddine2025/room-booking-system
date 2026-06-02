import "./About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <h1>About</h1>
          <p>
            Room Booking Management System is a modern platform that helps users
            book rooms easily and allows administrators to manage reservations
            in an organized and efficient way.
          </p>
        </div>

        <div className="about-services">
          <div className="about-card">
            <h2>Room Reservation</h2>
            <p>
              Users can browse available rooms and submit booking requests
              quickly and clearly.
            </p>
          </div>

          <div className="about-card">
            <h2>Booking Tracking</h2>
            <p>
              Students can view booking details, follow reservation status, and
              manage their requests.
            </p>
          </div>

          <div className="about-card">
            <h2>Admin Control</h2>
            <p>
              Administrators can manage rooms, approve bookings, and monitor the
              whole system easily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;