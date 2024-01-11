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
import { Box, Button, ButtonGroup } from "@mui/joy";
import { useEffect, useState } from "react";
import {
  resetViewport,
  setChartMode,
  setClickedTarget,
  setCurrentTarget,
  setLevel,
  setTableMode,
} from "../../reducers/interfaceReducer";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import ExploreIcon from "@mui/icons-material/Explore";
import { Close, TableChart } from "@mui/icons-material";
import { deleteMap } from "../../reducers/mapReducer";

const ChartComponent = ({ ID, data, bounds }) => {
  Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    annotationPlugin,
    Tooltip
  );

  const level = useSelector((state) => state.interface.level);
  const levels = useSelector((state) => state.interface.levels);
  const compare = useSelector((state) => state.interface.compareToggle);
  const map = useSelector((state) => state.maps[ID]);
  const currentTarget = useSelector((state) => state.interface.currentTarget);
  const hover = useSelector((state) => state.interface.hover);

  const { max } = useSelector((state) =>
    compare
      ? state.interface.minMax[3][level]
      : state.interface.minMax[ID][level]
  );

  const dispatch = useDispatch();

  const [codes, setCodes] = useState(null);
  const [displayAverage, setDisplayAverage] = useState(false);
  const [localAverage, setLocalAverage] = useState(null);

  useEffect(() => {
    setCodes(null);
    const codes = Object.keys(data[level]).filter((code) => code.trim() !== "");

    const filteredCodes = currentTarget
      ? codes.filter((code) =>
          code.startsWith(String(currentTarget.targetCode))
        )
      : codes;

    setCodes(filteredCodes);
  }, [data, level, currentTarget]);

  const handleResetClick = () => {
    dispatch(resetViewport());
    dispatch(setCurrentTarget(null));
    dispatch(setLevel(levels[0]));
    dispatch(setClickedTarget(null));
  };

  const handleDeleteClick = () => {
    handleResetClick();
    dispatch(deleteMap(ID));
  };

  const handleTableButton = () => {
    dispatch(setTableMode(ID));
    dispatch(setChartMode(ID));
  };

  const average =
    map.type === "comparaison"
      ? [map.parti[0].prc, map.parti[1].prc]
      : map.type === "TP"
      ? map.tp.tp
      : map.parti.prc;

  const handleGraphButton = () => {
    dispatch(setChartMode(ID));
  };

  useEffect(() => {
    if (currentTarget) {
      // if (map.type === "comparaison") {
      //   setLocalAverage(
      //     data[currentTarget.targetLevel][
      //       currentTarget.targetCode
      //     ].oldprc.toFixed(1)
      //   );
      // } else
      //   setLocalAverage(
      //     data[currentTarget.targetLevel][
      //       currentTarget.targetCode
      //     ]?.prc.toFixed(1)
      //   );
      setLocalAverage(
        map.type === "comparaison"
          ? data[currentTarget.targetLevel][
              currentTarget.targetCode
            ].oldprc.toFixed(1)
          : map.type === "TP"
          ? data[currentTarget.targetLevel][
              currentTarget.targetCode
            ]?.tp.toFixed(1)
          : data[currentTarget.targetLevel][
              currentTarget.targetCode
            ]?.prc.toFixed(1)
      );
    }
    if (!currentTarget) {
      setDisplayAverage(false);
      setLocalAverage(null);
    }
  }, [currentTarget]);

  const handleClick = (object) => {
    const code = codes[object[0].index];
    const name = data[level][code].nom_fr;

    dispatch(
      setCurrentTarget({
        targetName: name,
        targetCode: code,
        targetLevel: level,
      })
    );

    dispatch(setLevel(levels[1]));
  };

  const displayedVariable = map.type === "TP" ? "tp" : "prc";
  if (!codes) return <span>loading</span>;
  return (
    <Box>
      <ButtonGroup>
        <Button
          variant={displayAverage ? "solid" : "outlined"}
          onClick={() => setDisplayAverage(!displayAverage)}
        >
          Afficher les moyennes
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
          {" "}
          <Button onClick={handleDeleteClick}>
            <Close />
          </Button>
          <Button
            disabled={level === levels[0] ? true : false}
            onClick={handleResetClick}
          >
            <UndoIcon />
          </Button>
          <Button onClick={handleGraphButton}>
            <ExploreIcon />
          </Button>
          <Button onClick={handleTableButton}>
            <TableChart />
          </Button>
        </ButtonGroup>
        <Box height={500} width={400}>
          {codes && data[level] && (
            <Bar
              data={{
                labels: codes
                  ? codes.map((code) =>
                      data[level][code] ? data[level][code]["nom_fr"] : null
                    )
                  : null,
                datasets:
                  map.type === "comparaison"
                    ? [
                        {
                          label: `${
                            map.parti[0].code_parti
                          } - ${map.election[0].nom.slice(-4)}`,
                          data: codes.map((code) =>
                            data[level][code]
                              ? data[level][code]["oldprc"]
                              : null
                          ),
                          backgroundColor: "rgba(255, 99, 132, 0.6)",
                        },
                        {
                          label: `${
                            map.parti[1].code_parti
                          } - ${map.election[1].nom.slice(-4)}`,
                          data: codes.map((code) =>
                            data[level][code]
                              ? data[level][code]["newprc"]
                              : null
                          ),
                          backgroundColor: "rgba(75, 192, 192, 0.6)",
                        },
                      ]
                    : [
                        {
                          label: "Pourcentage",
                          data: codes.map((code) =>
                            data[level][code]
                              ? data[level][code][displayedVariable]
                              : null
                          ),
                          backgroundColor: "rgba(54, 162, 235, 0.6)",
                        },
                      ],
              }}
              options={{
                parsing: {
                  xAxisKey: "nom_fr",
                  yAxisKey: displayedVariable,
                },
                scales: {
                  y: {
                    suggestedMax: max,
                    beginAtZero: true,
                  },
                },
                onHover: (event, elements) => {
                  // if (elements.length) {
                  //   dispatch(setHover(datasets[elements[0].index]));
                  // }
                },
                onClick: (event, elements) => {
                  if (elements.length > 0) handleClick(elements);
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
                interaction: {
                  intersect: false,
                  mode: "index",
                },
                plugins: {
                  annotation: {
                    annotations: displayAverage
                      ? map.type === "comparaison"
                        ? [
                            {
                              type: "line",
                              value: average[0],
                              yMin: average[0],
                              yMax: average[0],
                              borderColor: "rgba(255, 99, 132, 0.6)",
                              borderWidth: 2,
                              label: {
                                display: true,
                                enabled: true,
                                position: "start",
                                content: `${
                                  map.parti[0].code_parti
                                } - ${map.election[0].nom.slice(-4)}: ${
                                  average[0]
                                }%`,
                              },
                            },
                            {
                              type: "line",
                              value: average[1],
                              yMin: average[1],
                              yMax: average[1],
                              borderColor: "rgba(75, 192, 192, 0.6)",
                              borderWidth: 2,
                              label: {
                                display: true,
                                enabled: true,
                                position: "end",
                                content: `${
                                  map.parti[1].code_parti
                                } - ${map.election[1].nom.slice(-4)}: ${
                                  average[1]
                                }%`,
                              },
                            },
                          ]
                        : [
                            {
                              type: "line",
                              value: average,
                              yMin: average,
                              yMax: average,
                              borderColor: "rgb(75, 192, 192)",
                              borderWidth: 2,
                              label: {
                                display: true,
                                enabled: true,
                                position: "start",
                                content: `Moyenne Nationale: ${average}%`,
                              },
                            },
                            {
                              type: "line",
                              display: localAverage,
                              value: localAverage,
                              yMin: localAverage,
                              yMax: localAverage,
                              borderColor: "rgb(180, 0, 3)",
                              borderWidth: 2,
                              label: {
                                display: localAverage,
                                enabled: localAverage,
                                position: "end",
                                content: currentTarget
                                  ? `Moyenne ${currentTarget.targetName}: ${localAverage}%`
                                  : null,
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChartComponent;
