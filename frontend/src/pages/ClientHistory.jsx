import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

function ClientHistory() {
  const navigate = useNavigate();
  const token = getToken();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch(
      `${API_URL}/api/appointments/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setAppointments(data);
  };

  return (
    <div className="container">
      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        appointments.map((appt) => (
          <div key={appt._id} className="dashboard-card">
            <p>Date: {appt.date}</p>
            <p>Time: {appt.time}</p>
            <p>Status: {appt.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ClientHistory;
