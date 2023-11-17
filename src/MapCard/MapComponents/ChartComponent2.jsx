import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { useSelector } from "react-redux";
import { Box } from "@mui/joy";

const ChartComponent2 = ({ data, bounds }) => {
  Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    annotationPlugin,
    Tooltip
  );

  const level = useSelector((state) => state.interface.level);
  const currentTarget = useSelector((state) => state.currentTarget);
  const hover = useSelector((state) => state.interface.hover);

  const key = Object.keys(data[level])[0];

  const names = Object.values(bounds[level]).map((item) => item.name);
  const values = Object.values(data[level]["prc"]).slice(0, -1);

  const average = data[level]["prc"]["Total"];

  const config = {
    labels: names,
    datasets: [
      {
        // label: level,
        data: values,
      },
    ],
  };

  return (
    <Box height={500} width={400}>
      <Bar
        data={config}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          elements: {
            bar: {
              backgroundColor: "blue",
              hoverBackgroundColor: "red",
              hoverBorderWidth: "1",
            },
          },
          plugins: {
            annotation: {
              annotations: [
                {
                  type: "line",
                  value: average,
                  yMin: average,
                  yMax: average,
                  borderColor: "rgb(75, 192, 192)",
                  borderWidth: 2,
                  label: {
                    enabled: false,
                    content: "Test label",
                  },
                },
              ],
            },
            tooltip: {
              padding: 12,
              titleFont: {
                size: 22,
              },
              bodyFont: {
                size: 18,
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default ChartComponent2;
