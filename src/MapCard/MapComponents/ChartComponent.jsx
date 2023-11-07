import { Box } from "@mui/joy";
import { BarChart, ChartContainer } from "@mui/x-charts";
import { useSelector } from "react-redux";

function ChartComponent({ data, bounds }) {
  const level = useSelector((state) => state.interface.level);
  const hover = useSelector((state) => state.interface.hover);

  const names = Object.values(bounds[level]).map((item) => item.name);
  const values = Object.values(data[level]["prc"]).slice(0, -1);
  console.log(values);

  return (
    <BarChart
      xAxis={[{ id: "values", data: names, scaleType: "band" }]}
      series={[{ data: values }]}
      width={500}
      height={300}
    />
  );
}

export default ChartComponent;
