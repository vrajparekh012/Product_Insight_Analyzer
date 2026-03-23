import { Bar } from "react-chartjs-2";

function RatingChart({ ratings }) {

  const data = {
    labels: Object.keys(ratings),
    datasets: [
      {
        label: "Ratings",
        data: Object.values(ratings),

        backgroundColor: [
          "#ff0000",
          "#ff6600",
          "#ffcc00",
          "#99cc00",
          "#00cc66"
        ],

        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{width:"500px"}}>
      <h3>Rating Distribution</h3>
      <Bar data={data}/>
    </div>
  );
}

export default RatingChart;