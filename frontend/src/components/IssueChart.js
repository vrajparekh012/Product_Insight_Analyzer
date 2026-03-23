import { Bar } from "react-chartjs-2";

function IssueChart({ issues }) {

  const counts = {};

  issues.forEach(issue => {
    counts[issue] = (counts[issue] || 0) + 1;
  });

  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        label: "Issue Frequency",
        data: Object.values(counts),

        backgroundColor: "#2196F3"
      }
    ]
  };

  return (
    <div style={{width:"600px"}}>
      <h3>Detected Product Issues</h3>
      <Bar data={data}/>
    </div>
  );
}

export default IssueChart;