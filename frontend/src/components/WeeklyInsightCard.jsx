function WeeklyInsightCard({ insight }) {
  return (
    <article className="mental-card insight-panel">
      <div className="mental-card-head">
        <div>
          <span className="mental-card-kicker">Weekly Insights</span>
          <h3>Your reflection summary</h3>
        </div>
        <span className={`trend-pill ${insight?.moodTrend || "steady"}`}>
          {insight?.moodTrend || "steady"}
        </span>
      </div>

      <div className="insight-metrics">
        <div>
          <strong>{insight?.moodAverage ?? 0}</strong>
          <span>Average mood</span>
        </div>
        <div>
          <strong>{insight?.scheduleProgress ?? 0}%</strong>
          <span>Schedule progress</span>
        </div>
        <div>
          <strong>{insight?.dreamProgress ?? 0}%</strong>
          <span>Dream progress</span>
        </div>
      </div>

      <div className="insight-copy">
        {(insight?.suggestions || []).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </article>
  );
}

export default WeeklyInsightCard;
