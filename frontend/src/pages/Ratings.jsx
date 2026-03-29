import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import PageWrapper from "../components/PageWrapper";
import { API_URL } from "../config/api";

function Ratings() {
  const token = getToken();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/ratings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRatings(data));
  }, []);

  const avgRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) /
          ratings.length
        ).toFixed(1)
      : 0;

  return (
    <PageWrapper>
      <div className="container">
        <h1>Client Ratings</h1>

        <h2>Average Rating: ⭐ {avgRating}</h2>

        {ratings.map((r) => (
          <div key={r._id} className="dashboard-card">
            <p><strong>{r.user?.name}</strong></p>
            <p>⭐ {r.rating}/5</p>
            <p>{r.review}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export default Ratings;
