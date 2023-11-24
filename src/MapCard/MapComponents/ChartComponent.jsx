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
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, ButtonGroup, Radio, Switch } from "@mui/joy";
import { useEffect, useState } from "react";
import { setHover } from "../../reducers/interfaceReducer";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import ExploreIcon from "@mui/icons-material/Explore";

const ChartComponent = ({ data, bounds }) => {
  Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    annotationPlugin,
    Tooltip
  );

  const level = useSelector((state) => state.interface.level);
  const currentTarget = useSelector((state) => state.interface.currentTarget);
  const hover = useSelector((state) => state.interface.hover);
  const dispatch = useDispatch();

  const [datasets, setDatasets] = useState(null);
  const [displayAverage, setDisplayAverage] = useState(false);

  useEffect(() => {
    const combinedObject = [];

    Object.keys(bounds[level]).forEach((key) => {
      const filterString =
        currentTarget !== null ? currentTarget.toString() : null;

      if (currentTarget !== null && !key.startsWith(filterString)) {
        return;
      }

      const obj = {
        code: Number(key),
        name: bounds[level][key].name,
        value: data[level]["prc"][key],
      };
      combinedObject.push(obj);
    });

    setDatasets(combinedObject);
  }, [bounds, data, currentTarget, level]);

  const average = data["gouvernorat"]["prc"]["Total"];

  return (
    <Box>
      <ButtonGroup>
        <Button
          variant="soft"
          endDecorator={
            <Switch
              checked={displayAverage}
              onChange={() => setDisplayAverage(event.target.checked)}
            />
          }
        >
          Moyenne generale
        </Button>
      </ButtonGroup>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <ButtonGroup
          orientation="vertical"
          size="sm"
          sx={{ padding: "0.25rem" }}
        >
          <Button>
            <EqualizerOutlinedIcon />
          </Button>
          <Button>
            <ExploreIcon />
          </Button>
        </ButtonGroup>
        <Box height={500} width={400}>
          <Bar
            data={{
              datasets: [{ data: datasets }],
            }}
            options={{
              parsing: {
                xAxisKey: "name",
                yAxisKey: "value",
              },
              onHover: (event, elements) => {
                if (elements.length) {
                  dispatch(setHover(datasets[elements[0].index]));
                }
              },
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
                  annotations: displayAverage
                    ? [
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
                      ]
                    : null,
                },
                tooltip: {
                  callbacks: {},
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
      </Box>
    </Box>
  );
};

export default ChartComponent;
