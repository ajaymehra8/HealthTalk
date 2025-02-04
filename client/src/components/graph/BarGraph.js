import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Box } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

const BarGraph = () => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Steps",
        data: [1000, 10, 20, 40, 9000],
        borderColor: "gray",
        backgroundColor: "gray", // Light green shade
      },
    ],
  };

  return (
   
      <Bar options={options} data={data} style={{ height: "100px",marginTop:"20px" }} />
    
  );
};

export default BarGraph;
