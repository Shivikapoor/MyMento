import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { getToken } from "../utils/auth";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

function RateSession() {
  const token = getToken();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setMessage("Please select a rating ⭐");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: Number(rating),
          review,
        }),
      });

      if (res.ok) {
        setMessage("Thank you for your feedback ❤️");
        setReview("");
        setRating(0);

        setTimeout(() => {
          setMessage("");
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <PageWrapper>
      <div className="container">
        <h1>Rate Your Experience</h1>

        <form className="card" onSubmit={handleSubmit}>
          {/* ⭐ STAR RATING UI */}
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= (hover || rating) ? "active" : ""
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>

          {/* 📝 Review */}
          <textarea
            placeholder="Write your feedback..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">
            Submit Rating
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </PageWrapper>
  );
}

export default RateSession;
