// src/components/DocumentsChart.jsx
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import api from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DocumentsChart({ type = "category" }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, setChartType] = useState("bar");

  const colors = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(255, 99, 132, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(199, 199, 199, 0.6)",
    "rgba(83, 102, 255, 0.6)",
    "rgba(255, 102, 204, 0.6)",
  ];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("/api/documents/");
        const docs = res.data;

        let counts = {};

        if (type === "category") {
          docs.forEach((doc) => {
            const cat = doc.category_name || "Non défini";
            counts[cat] = (counts[cat] || 0) + 1;
          });
        } else if (type === "user") {
          docs.forEach((doc) => {
            const user = doc.owner_username || "Non défini";
            counts[user] = (counts[user] || 0) + 1;
          });
        } else if (type === "date") {
          docs.forEach((doc) => {
            const date = doc.uploaded_at?.slice(0, 10) || "Non défini";
            counts[date] = (counts[date] || 0) + 1;
          });
        }

        setChartData({
          labels: Object.keys(counts),
          datasets: [
            {
              label: "Documents",
              data: Object.values(counts),
              backgroundColor: Object.keys(counts).map(
                (_, i) => colors[i % colors.length]
              ),
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocuments();
  }, [type]);

  return (
    <div className="p-4  rounded-lg shadow-md bg-zinc-900 mb-5">
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block mb-1 font-semibold">
            Type de graphique :
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="input input-bordered"
          >
            <option value="bar">Barres</option>
            <option value="doughnut">Doughnut</option>
          </select>
        </div>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        {chartType === "doughnut" ? (
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Documents" },
              },
            }}
          />
        ) : (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Documents" },
              },
              scales: { y: { beginAtZero: true } },
            }}
          />
        )}
      </div>
    </div>
  );
}
