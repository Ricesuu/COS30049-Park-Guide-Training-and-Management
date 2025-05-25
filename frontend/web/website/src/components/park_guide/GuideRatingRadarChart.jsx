import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { auth } from "../../Firebase"; // Update path if needed

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function GuideRatingRadarChart() {
  const [ratingData, setRatingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return setError("Not logged in.");

        const token = await user.getIdToken();
        const res = await fetch(`/api/ratings/park-guide/self`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) setRatingData(data);
        else setError(data.error || "Failed to load ratings.");
      } catch (err) {
        console.error(err);
        setError("Error fetching ratings.");
      }
    };

    fetchRatings();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!ratingData) return <p>Loading radar chart...</p>;

  const labelMap = {
    language: "Language",
    knowledge: "Knowledge",
    organization: "Organization",
    engagement: "Engagement",
    safety: "Safety",
  };
  const labels = Object.keys(ratingData).map((key) => labelMap[key] || key);
  const values = Object.values(ratingData);

  const chartData = {
    labels,
    datasets: [
        {
        label: "Visitor Ratings",
        data: values,
        backgroundColor: "rgba(132, 204, 22, 0.3)",       // lime-500 @ 30% opacity
        borderColor: "rgba(132, 204, 22, 1)",             // lime-500 border
        borderWidth: 3,
        pointBackgroundColor: "rgba(132, 204, 22, 1)",    // lime-500 points
        pointRadius: 5,
        pointHoverRadius: 7,
        }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.formattedValue;
            return `${label}: ${value} / 5`;
          },
        },
      },
      legend: {
        labels: {
          font: { size: 14, weight: "bold" },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 12 },
          backdropColor: "transparent",
        },
        pointLabels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          circular: true,
        },
      },
    },
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-4">Visitor Ratings</h3>
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
}
