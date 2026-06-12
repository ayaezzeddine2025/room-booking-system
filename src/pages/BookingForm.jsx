import "./BookingForm.css";

function BookingForm() {
  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Booking Form</h1>
          <p>Fill in the details below to submit your room booking request.</p>
        </div>

        <form className="booking-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Room Number</label>
            <input type="text" placeholder="Enter room number" />
          </div>

          <div className="form-group">
            <label>Room Type</label>
            <select>
              <option value="">Select room type</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="triple">Triple Room</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" />
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea placeholder="Write any extra notes here"></textarea>
          </div>

          <button type="submit" className="booking-btn">
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;