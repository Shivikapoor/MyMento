import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import PageWrapper from "../components/PageWrapper";
import { getToken, getUser } from "../utils/auth";
import "../styles/mentalHealth.css";

const prompts = [
  "List three strengths you want your future role to use every day.",
  "Choose one learning step this week that moves you closer to your career goal.",
  "Notice which tasks energize you and which ones drain you.",
];

function CareerGuide() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "counsellor") {
      navigate("/counsellor-dashboard");
    }
  }, [navigate, token, user?.role]);

  return (
    <PageWrapper>
      <div className="mental-layout">
        <DashboardNavbar />

        <main className="mental-page-shell">
          <section className="mental-page-hero">
            <span className="section-tag">Career Guide</span>
            <h1>Gentle direction for your next chapter</h1>
            <p>
              Use these prompts to connect your ambition with small, realistic
              actions that fit your current season.
            </p>
          </section>

          <section className="mental-card">
            <div className="simple-list">
              {prompts.map((prompt) => (
                <div key={prompt} className="simple-list-row prompt-row">
                  <strong>Prompt</strong>
                  <span>{prompt}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageWrapper>
  );
}

export default CareerGuide;
