import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function DreamProgressCard({ dataSet }) {
  const completed = dataSet?.completedDreamTasks || 0;
  const total = dataSet?.totalDreamTasks || 0;
  const remaining = Math.max(total - completed, 0);

  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: total ? [completed, remaining] : [0, 1],
        backgroundColor: ["#7b6dff", "#e7ebf3"],
        borderWidth: 0,
        cutout: "72%",
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
          <span className="mental-card-kicker">Dream Progress</span>
          <h3>{dataSet?.progress || 0}% complete</h3>
        </div>
      </div>
      <div className="chart-shell doughnut-shell">
        <Doughnut data={data} options={options} />
      </div>
    </article>
  );
}

export default DreamProgressCard;
