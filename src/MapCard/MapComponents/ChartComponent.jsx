import { Box } from "@mui/joy";
import {
  BarChart,
  BarPlot,
  ChartContainer,
  ChartsXAxis,
  ChartsYAxis,
  ChartReferenceLine,
} from "@mui/x-charts";
import { useSelector } from "react-redux";

function ChartComponent({ data, bounds }) {
  const level = useSelector((state) => state.interface.level);
  const hover = useSelector((state) => state.interface.hover);

  const key = Object.keys(data[level])[0];

  const names = Object.values(bounds[level]).map((item) => item.name);
  const values = Object.values(data[level]["prc"]).slice(0, -1);

  const average = data[level]["prc"]["Total"];

  const series = [
    {
      type: "bar",
      yAxisKey: "values",
      data: values,
    },
  ];

  return (
    <ChartContainer
      width={450}
      height={600}
      margin={{ right: 0, bottom: 110 }}
      series={series}
      xAxis={[{ id: "names", data: names, scaleType: "band" }]}
      yAxis={[{ id: "values", scaleType: "linear" }]}
      bottomAxis={{
        axisId: "names",
        labelStyle: {
          fontSize: 14,
        },
        tickLabelStyle: {
          angle: -45,
          textAnchor: "end",
          fontSize: 12,
        },
        tickLabelInterval: () => true,
      }}
    >
      <BarPlot />
      <ChartReferenceLine
        y={average}
        label="Moyenne Nationale"
        lineStyle={{ stroke: "red" }}
      />
      <ChartsXAxis
        axisId="names"
        label={level}
        labelStyle={{
          fontSize: "1rem",
        }}
        position="bottom"
        tickLabelStyle={{ angle: -45, textAnchor: "end", fontSize: 12 }}
        tickLabelInterval={() => true}
      />
      <ChartsYAxis label={key} position="left" axisId="values" />
    </ChartContainer>
    // <BarChart
    //   xAxis={[{ id: "names", data: names, scaleType: "band" }]}
    // bottomAxis={{
    //   axisId: "names",
    //   labelStyle: {
    //     fontSize: 14,
    //   },
    //   tickLabelStyle: {
    //     angle: -45,
    //     textAnchor: "end",
    //     fontSize: 12,
    //   },
    //   tickLabelInterval: () => true,
    // }}
    //   series={[{ data: values }]}
    //   width={450}
    //   height={600}
    //   margin={{ right: 0, bottom: 90 }}
    // />
  );
}

export default ChartComponent;
