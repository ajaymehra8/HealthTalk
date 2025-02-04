import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
ChartJS.register({
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
});
const LineGraph = () => {
    const options = {
        responsive:true,
        plugins:{
            legend:{
                position:"bottom"
            }
        }
      };
  const data = {
    labels: [
      "Week 1",
      "Week 2",
      "Week 3",
      "Week 4",
      "Week 5",
    ],
    datasets: [
      {
        label: "Steps",
        data: [1000, 10, 20, 10, 9000],
        borderColor: "gray",
        borderWidth:2
      },
    ],
  };
  return <Line options={options} data={data} style={{marginTop:"20px"}}/>;
};

export default LineGraph;
