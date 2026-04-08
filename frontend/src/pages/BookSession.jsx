import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { getToken, getUser } from "../utils/auth";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

function BookSession() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  if (!token) {
    navigate("/login");
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const slots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const [formData, setFormData] = useState({
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    date: "",
    time: "",
  });

  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!formData.date) return;

    fetch(`${API_URL}/api/appointments/booked-slots?date=${formData.date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookedSlots(data);
        } else {
          setBookedSlots([]);
        }
      })
      .catch(() => setBookedSlots([]));
  }, [formData.date, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData((prev) => ({
          ...prev,
          date: "",
          time: "",
        }));

        setTimeout(() => {
          setSuccess(false);
          navigate("/");
        }, 3000);
      } else {
        setMessage(data.message || "Something went wrong");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container booking-page">
        <div className="booking-shell">
          <button
            type="button"
            className="booking-back-btn"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          <section className="booking-card">
            <div className="booking-copy-panel">
              <div className="booking-brand brand-inline">
                <img
                  src="/images/Logo.png"
                  alt="MyMento logo"
                  className="brand-logo brand-logo-title"
                />
                <span>MyMento</span>
              </div>

              <span className="booking-eyebrow">Personal session planner</span>
              <h1>Book a Session</h1>
              <p>
                Choose a calm time that works for you. We will automatically
                block booked and expired slots so booking stays simple.
              </p>

              <div className="booking-user-chip">
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>

              <div className="booking-info-list">
                <div>
                  <strong>Live availability</strong>
                  <span>Only open time slots remain selectable for the chosen day.</span>
                </div>
                <div>
                  <strong>Smooth booking flow</strong>
                  <span>Your details are already filled in, so you can book faster.</span>
                </div>
              </div>
            </div>

            <div className="booking-form-panel">
              <div className="booking-form-head">
                <h2>Session Details</h2>
                <p>Pick your date and time, then send the booking request.</p>
              </div>

              <form className="booking-form" onSubmit={handleSubmit}>
                <label className="booking-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    disabled
                  />
                </label>

                <label className="booking-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    disabled
                  />
                </label>

                <label className="booking-field">
                  <span>Select Date</span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </label>

                <label className="booking-field">
                  <span>Select Time</span>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Time</option>

                    {slots.map((slot) => {
                      const slotTime = new Date(`${formData.date}T${slot}:00`);
                      const now = new Date();
                      const isPast = formData.date === today && slotTime < now;
                      const isBooked = bookedSlots.includes(slot);

                      let label = `Available • ${slot}`;
                      if (isBooked) label = `Booked • ${slot}`;
                      else if (isPast) label = `Passed • ${slot}`;

                      return (
                        <option
                          key={slot}
                          value={slot}
                          disabled={isBooked || isPast}
                        >
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <button
                  type="submit"
                  className="booking-submit-btn"
                  disabled={loading || !formData.time}
                >
                  {loading ? "Booking..." : "Book Session"}
                </button>
              </form>

              {message ? <div className="booking-alert error">{message}</div> : null}
              {success ? (
                <div className="booking-alert success">
                  Session booked successfully!
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
}

export default BookSession;
