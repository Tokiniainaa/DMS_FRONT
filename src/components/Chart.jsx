// src/components/DocumentsChart.jsx
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DocumentsChart({ type = "category" }) {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

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
              backgroundColor: "rgba(75, 192, 192, 0.6)",
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
    <div style={{ width: "100%", height: 400 }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: { legend: { position: "top" } },
          scales: { y: { beginAtZero: true } },
        }}
      />
    </div>
  );
}
