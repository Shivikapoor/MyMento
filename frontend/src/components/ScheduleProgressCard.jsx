import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function ScheduleProgressCard({ stats }) {
  const schedule = stats?.schedule || { completed: 0, pending: 0, missed: 0 };

  const data = {
    labels: ["Completed", "Pending", "Missed"],
    datasets: [
      {
        data: [schedule.completed, schedule.pending, schedule.missed],
        backgroundColor: ["#5fcf9f", "#ffd166", "#ff8a80"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <article className="mental-card chart-card">
      <div className="mental-card-head">
        <div>
          <span className="mental-card-kicker">Schedule Progress</span>
          <h3>{stats?.scheduleProgress || 0}% complete</h3>
        </div>
      </div>
      <div className="chart-shell pie-shell">
        <Pie data={data} options={options} />
      </div>
    </article>
  );
}

export default ScheduleProgressCard;
