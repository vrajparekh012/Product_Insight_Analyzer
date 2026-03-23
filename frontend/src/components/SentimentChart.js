import React from "react";
import { Pie } from "react-chartjs-2";
import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function SentimentChart({ data }) {

if (!data) return null;

const labels = Object.keys(data);
const values = Object.values(data);

const chartData = {
labels: labels,
datasets: [
{
label: "Sentiment Distribution",
data: values,
backgroundColor: [
"#4CAF50",
"#FFC107",
"#F44336"
]
}
]
};

return (
<div style={{width:"300px"}}> <Pie data={chartData}/> </div>
);
}

export default SentimentChart;