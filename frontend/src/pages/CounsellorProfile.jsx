import { useEffect, useState } from "react";
import { API_URL, UPLOADS_BASE_URL } from "../config/api";
import { getToken, getUser } from "../utils/auth";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

function CounsellorProfile() {
  const token = getToken();
  const user = getUser();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [certificateTitle, setCertificateTitle] = useState("");
  const [certificateImage, setCertificateImage] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/profile`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ UPDATED SAVE FUNCTION (FormData for image upload)
  const handleSave = async () => {
    const formData = new FormData();

    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("specialization", profile.specialization);
    formData.append("experience", profile.experience);
    formData.append("fees", profile.fees);
    formData.append("bio", profile.bio);

    if (certificateTitle) {
      formData.append("certificateTitle", certificateTitle);
    }

    if (certificateImage) {
      formData.append("certificateImage", certificateImage);
    }

    await fetch(`${API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setEditMode(false);
    window.location.reload(); // simple refresh to show new certificate
  };

  if (!profile) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="container">
        <h1>Counsellor Profile</h1>

        <div className="card">

          {editMode ? (
            <>
              <input name="name" value={profile.name} onChange={handleChange} />
              <input name="email" value={profile.email} onChange={handleChange} />
              <input name="specialization" value={profile.specialization} onChange={handleChange} />
              <input name="experience" value={profile.experience} onChange={handleChange} />
              <input name="fees" value={profile.fees} onChange={handleChange} />
              <textarea name="bio" value={profile.bio} onChange={handleChange} />

              {/* ✅ Certificate Section */}
              <h3>Add Certificate</h3>

              <input
                type="text"
                placeholder="Certificate Title"
                value={certificateTitle}
                onChange={(e) => setCertificateTitle(e.target.value)}
              />

              <input
                type="file"
                onChange={(e) => setCertificateImage(e.target.files[0])}
              />

              <button className="primary-btn" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Specialization:</strong> {profile.specialization}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>
              <p><strong>Fees:</strong> ₹{profile.fees}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>

              {/* ✅ Certificate Display */}
              {profile.certificates && profile.certificates.length > 0 && (
                <>
                  <h3 style={{ marginTop: "20px" }}>Certificates</h3>

                  {profile.certificates.map((cert, index) => (
                    <div key={index} style={{ marginBottom: "15px" }}>
                      <p>{cert.title}</p>
                      <img
                        src={`${UPLOADS_BASE_URL}/uploads/${cert.image}`}
                        alt="certificate"
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          marginTop: "8px",
                        }}
                      />
                    </div>
                  ))}
                </>
              )}

              {(user?.role === "admin" || user?.role === "counsellor") && (
                <button
                  className="primary-btn"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </PageWrapper>
  );
}

export default CounsellorProfile;
