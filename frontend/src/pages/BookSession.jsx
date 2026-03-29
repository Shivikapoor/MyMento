import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Fetch booked slots
  useEffect(() => {
    if (!formData.date) return;

    fetch(
      `http://localhost:5000/api/appointments/booked-slots?date=${formData.date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
      const res = await fetch("http://localhost:5000/api/appointments", {
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

        setFormData({
          ...formData,
          date: "",
          time: "",
        });

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
      <div className="container">
        <h1 className="brand-title">
          <img src="/images/Logo.png" alt="MyMento logo" className="brand-logo brand-logo-title" />
          <span>MyMento</span>
        </h1>

        <p className="welcome">
          Welcome, <strong>{user?.name}</strong>
        </p>

        <h2>Book a Session</h2>

        <form className="booking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            disabled
          />

          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            disabled
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
          />

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

              const isPast =
                formData.date === today && slotTime < now;

              const isBooked = bookedSlots.includes(slot);

              let label = `🟢 ${slot}`;

              if (isBooked) label = `🔴 ${slot} Booked`;
              else if (isPast) label = `⚫ ${slot} Passed`;

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

          <button
            type="submit"
            className="primary-btn"
            disabled={loading || !formData.time}
          >
            {loading ? "Booking..." : "Book Session"}
          </button>
        </form>

        {message && <div className="error-popup">{message}</div>}

        {success && (
          <div className="success-popup">
            Session booked successfully!
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default BookSession;
