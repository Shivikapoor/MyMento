import { useEffect, useState } from "react";
import { getToken, getUser, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

function CounsellorDashboard() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        navigate("/login");
        return;
      }

      const data = await res.json();
      setAppointments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "counsellor") {
      navigate("/login");
      return;
    }

    fetchAppointments();
  }, [token, user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchAppointments();
      } else {
        alert("Delete failed");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Confirmed" }),
      });

      if (res.ok) {
        fetchAppointments();
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error("Update error", error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Appointments Dashboard</h1>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="dashboard-list">
          {appointments.map((appt) => (
            <div key={appt._id} className="dashboard-card">
              <h3>{appt.clientName}</h3>
              <p>Email: {appt.clientEmail}</p>
              <p>Date: {appt.date}</p>
              <p>Time: {appt.time}</p>
              <p>
                Status:{" "}
                <strong
                  style={{
                    color: appt.status === "Confirmed" ? "#4caf50" : "#ffa500",
                  }}
                >
                  {appt.status}
                </strong>
              </p>

              <div className="dashboard-actions">
                {appt.status === "Pending" && (
                  <button
                    className="confirm-btn"
                    onClick={() => handleConfirm(appt._id)}
                  >
                    Confirm
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(appt._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CounsellorDashboard;
