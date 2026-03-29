import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

function MoodThisWeekCard({ moodData = [] }) {
  const data = {
    labels: moodData.map((item) => item.label),
    datasets: [
      {
        label: "Mood",
        data: moodData.map((item) => item.moodValue),
        tension: 0.35,
        borderColor: "#5086ff",
        backgroundColor: "rgba(80, 134, 255, 0.18)",
        fill: true,
        pointBackgroundColor: "#1f4ed8",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(123, 144, 173, 0.18)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <article className="mental-card chart-card wide">
      <div className="mental-card-head">
        <div>
          <span className="mental-card-kicker">Mood Tracking</span>
          <h3>Mood This Week</h3>
        </div>
      </div>
      <div className="chart-shell line-shell">
        <Line data={data} options={options} />
      </div>
    </article>
  );
}

export default MoodThisWeekCard;
