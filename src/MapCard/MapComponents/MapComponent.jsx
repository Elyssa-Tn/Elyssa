import UndoIcon from "@mui/icons-material/Undo";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import FileDownloadOffOutlinedIcon from "@mui/icons-material/FileDownloadOffOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import { useEffect, useState } from "react";
import custom from "../../assets/custom(3).json";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Sheet,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import {
  resetViewport,
  setChartMode,
  setClickedTarget,
  setCurrentTarget,
  setHover,
  setLevel,
  setLevelLock,
  setTableMode,
  setTooltip,
  setViewport,
} from "../../reducers/interfaceReducer";
import { DeckGL, GeoJsonLayer, WebMercatorViewport } from "deck.gl";
import { deleteMap } from "../../reducers/mapReducer";
import { FeaturedVideoRounded, TableChart } from "@mui/icons-material";

const PercentageBar = ({ value }) => {
  const normalizeValue = (value) => {
    return value === 0
      ? 50
      : value < -50
      ? 100
      : value >= 50
      ? 0
      : value < 0
      ? 75 + (value / 50) * 25
      : 25 + (value / 50) * 25;
  };

  const calculateWidth = (percentage) => {
    return {
      width: `${normalizeValue(percentage)}%`,
      height: "100%",
      transition: "width 0.5s ease-in-out",
    };
  };

  return (
    <Box
      style={{
        width: "200px",
        height: "16px",
        backgroundColor: "#4CAF50",
        border: "1px solid #ccc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        style={{ ...calculateWidth(value), backgroundColor: "#FF5733" }}
      ></Box>
    </Box>
  );
};

const MapComponent = ({
  ID,
  data,
  type,
  geojson,
  colors,
  divergingColors,
  displayMode,
  bounds,
}) => {
  const currentTarget = useSelector((state) => state.interface.currentTarget);
  const level = useSelector((state) => state.interface.level);
  const levels = useSelector((state) => state.interface.levels);
  const viewport = useSelector((state) => state.interface.viewport);
  const hover = useSelector((state) => state.interface.hover);
  const tooltip = useSelector((state) => state.interface.tooltip);
  const zoomLevel = useSelector((state) => state.interface.zoomLevel);
  const levelLock = useSelector((state) => state.interface.levelLock[ID]);

  const compare = useSelector((state) => state.interface.compareToggle);

  //TODO: HACK SOLUTION, FIX THIS:
  const formatting = { simple: "prc", indicator: "valeur", TP: "tp" };

  //CHANGE COLOR GENERATION ITS BAD

  const classNumber = useSelector((state) =>
    compare
      ? state.interface.classNumber[3][level]
      : state.interface.classNumber[ID][level]
  );

  const { min, max } = useSelector((state) =>
    compare
      ? state.interface.minMax[3][level]
      : state.interface.minMax[ID][level]
  );

  const dispatch = useDispatch();

  const [ready, setReady] = useState(false);
  const centerCoords = [33.9989, 10.1658];

  const minValueColor = colors[0];
  const maxValueColor = colors[1];

  const [singleValue, setSingleValue] = useState(false);

  const singleColorRange = (max - min) / classNumber;
  const stepSize = Math.floor(colors.length / classNumber);

  const selectedColors = [];

  for (var i = 0; i < classNumber; i++) {
    var index = i * stepSize;
    selectedColors.push(colors[index]);
  }

  const getColorOnScale = (value) => {
    const thresholds = [-10, -5, 0, 5, 10];

    if (value <= thresholds[0]) {
      return divergingColors[0];
    } else if (value >= thresholds[thresholds.length - 1]) {
      return divergingColors[divergingColors.length - 1];
    }

    for (let i = 1; i < thresholds.length; i++) {
      if (thresholds[i - 1] < value && value <= thresholds[i]) {
        return colors[i];
      }
    }
  };

  const getColorForValue = (value) => {
    const interval = Math.floor((value - min) / singleColorRange);

    return selectedColors[Math.min(interval, classNumber - 1)];
  };
  const rgbaToCssString = (rgba) => {
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3] / 255})`;
  };

  const getColor = (feature) => {
    if (type === "simple") {
      if (!data[level][feature.properties[`code_${level}`]])
        return [211, 211, 211, 200];
      const value = data[level][feature.properties[`code_${level}`]]["prc"];
      if (!value) return [211, 211, 211, 200];
      return getColorForValue(value);
    }
    if (type === "TP") {
      if (!data[level][feature.properties[`code_${level}`]])
        return [211, 211, 211, 200];
      const value = data[level][feature.properties[`code_${level}`]]["tp"];
      if (!value) return [211, 211, 211, 200];
      return getColorForValue(value);
    }

    if (type === "indicator") {
      if (!data[level][feature.properties[`code_${level}`]])
        return [211, 211, 211, 200];
      const value = data[level][feature.properties[`code_${level}`]]["valeur"];
      if (!value) return [211, 211, 211, 200];
      return getColorForValue(value);
    }

    if (type === "evolution" || type === "comparaison") {
      if (!data[level][feature.properties[`code_${level}`]])
        return [211, 211, 211, 200];
      const value = data[level][feature.properties[`code_${level}`]]["percent"];
      if (!value) return [211, 211, 211, 255];
      return getColorOnScale(value);
    }

    // if (singleValue) return colors[4];
    // if (value && displayMode === 2) return getColorForPercentileValue(value);
  };

  const getDifferentLevel = (levels, currentLevel, direction) => {
    const currentIndex = levels.indexOf(currentLevel);

    if (currentIndex === -1) {
      return null;
    }

    if (direction === "up" && currentIndex > 0) {
      return levels[currentIndex - 1];
    } else if (direction === "down" && currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    } else {
      return null;
    }
  };

  const handleResetClick = () => {
    dispatch(resetViewport());
    dispatch(setCurrentTarget(null));
    dispatch(setLevel(levels[0]));
    dispatch(setClickedTarget(null));
  };

  const handleCenterClick = () => {
    dispatch(resetViewport());
    dispatch(setCurrentTarget(null));
    // dispatch(setLevel(levels[0]));
    dispatch(setClickedTarget(null));
  };

  const handleDeleteClick = () => {
    handleResetClick();
    dispatch(deleteMap(ID));
  };

  const handleMousover = (object, x, y) => {
    if (object) {
      if (object.properties) {
        const code = object.properties[`code_${level}`];
        if (tooltip && tooltip.code === code) return;
        const name = object.properties[`nom_${level}`];
        // const valueGov =
        //   data["gouvernorat"]["prc"][target.feature.properties["code_gouvernorat"]];
        const nomGov = object.properties["nom_gouvernorat"];
        //TODO: reduce the frequency of dispatches
        dispatch(setHover({ code: code, name: name }));
        dispatch(
          setTooltip({
            position: { x, y },
            name,
            gouvernorat: {
              name: nomGov,
              // value: valueGov,
            },
            code,
            prc: data[level][code]
              ? type === "simple" || type === "indicator" || type === "TP"
                ? data[level][code][formatting[type]]
                : data[level][code]["percent"]
              : null,
          })
        );
      }
    } else {
      handleMouseout();
    }
  };

  const handleMouseout = () => {
    dispatch(setHover(null));
    dispatch(setTooltip(null));
  };

  const handleLockChange = () => {
    dispatch(setLevelLock(ID));
  };

  const handleGraphButton = () => {
    dispatch(setChartMode(ID));
  };

  const handleTableButton = () => {
    dispatch(setTableMode(ID));
  };

  const handleClick = (object) => {
    handleMouseout();
    const code = object.properties[`code_${level}`];
    const name = object.properties[`nom_${level}`];
    dispatch(
      setCurrentTarget({
        targetName: name,
        targetCode: code,
        targetLevel: level,
      })
    );
    // const { _southWest, _northEast } = bounds[level][code].bounds;

    // const boundaries = [
    //   [_southWest.lng, _southWest.lat],
    //   [_northEast.lng, _northEast.lat],
    // ];

    // const viewportWebMercator = new WebMercatorViewport(viewport);

    // const { longitude, latitude, zoom } = viewportWebMercator.fitBounds(
    //   boundaries,
    //   { width: 408, height: 500 }
    // );
    // if (!levelLock) {
    //   dispatch(setLevel(levels[1]));
    // }

    // dispatch(
    //   setViewport({
    //     ...viewport,
    //     latitude,
    //     longitude,
    //     zoom,
    //   })
    // );
  };

  useEffect(() => {
    if (currentTarget) moveViewport(currentTarget);
  }, [currentTarget]);

  const moveViewport = ({ targetCode, targetLevel }) => {
    const { _southWest, _northEast } = bounds[targetLevel][targetCode].bounds;

    const boundaries = [
      [_southWest.lng, _southWest.lat],
      [_northEast.lng, _northEast.lat],
    ];

    const viewportWebMercator = new WebMercatorViewport(viewport);

    const { longitude, latitude, zoom } = viewportWebMercator.fitBounds(
      boundaries,
      { width: 408, height: 500 }
    );

    //TODO: Remove this
    if (!levelLock) {
      dispatch(
        level === levels[levels.length - 1]
          ? dispatch(setLevel(level))
          : dispatch(setLevel(levels[levels.indexOf(level) + 1]))
      );
    }

    dispatch(
      setViewport({
        ...viewport,
        latitude,
        longitude,
        zoom,
      })
    );
  };

  const layers = Object.keys(geojson)
    .reverse()
    .map((mapLevel, index) => {
      const data = geojson[mapLevel];
      return new GeoJsonLayer({
        key: mapLevel,
        id: mapLevel,
        data: currentTarget
          ? data.features.filter((feature) =>
              feature.properties[`code_${mapLevel}`]
                .toString()
                .startsWith(currentTarget.targetCode)
            )
          : data,
        pickable: mapLevel === level,
        // stroked: mapLevel === level,
        stroked: true,
        filled: mapLevel === level,
        extruded: false,
        lineWidthMinPixels: index === 1 ? 2 : 0.5,
        getLineColor: [3, 3, 3],
        getFillColor: (feature) => getColor(feature),
        onHover: ({ object, x, y }) => handleMousover(object, x, y),
        onClick: ({ object }) => handleClick(object),
        updateTriggers: {
          getFillColor: type,
        },
      });
    });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: ID === 2 ? "row-reverse" : "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {tooltip && (
        <Sheet
          style={{
            position: "absolute",
            transform: "translateX(-50%)",
            left: tooltip.position.x,
            top: tooltip.position.y - (type === "comparaison" ? 100 : 50),
            borderRadius: "0.25rem",
            padding: "0.25rem",
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Typography level="body-lg">{tooltip.name}</Typography>
              {level !== levels[0] && (
                <Typography level="body-sm">
                  &nbsp;{tooltip.gouvernorat.name}
                </Typography>
              )}
            </Box>
            <Divider />
            {/* TODO: BETTER ORGANIZAITON HERE */}
            {tooltip.prc ? (
              type === "simple" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: "0.25rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography level="body-md">
                      {data[level][tooltip.code]["voix"]}
                    </Typography>
                    <Typography level="body-sm">&nbsp;voix</Typography>
                  </Box>
                  <Divider
                    sx={{ margin: "0 0.25rem" }}
                    orientation="vertical"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography
                      style={{
                        background: rgbaToCssString(
                          getColorForValue(data[level][tooltip.code]["prc"])
                        ),
                        width: "1.5rem",
                        height: "1.5rem",
                        border: "1px solid #333",
                      }}
                    ></Typography>
                    <Typography>
                      &nbsp;
                      {data[level][tooltip.code]["prc"].toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              ) : type === "indicator" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: "0.25rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography
                      style={{
                        background: rgbaToCssString(
                          getColorForValue(data[level][tooltip.code]["valeur"])
                        ),
                        width: "1.5rem",
                        height: "1.5rem",
                        border: "1px solid #333",
                      }}
                    ></Typography>
                    <Typography>
                      &nbsp;
                      {data[level][tooltip.code]["valeur"].toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              ) : type === "comparaison" || type === "evolution" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingTop: "0.25rem",
                      }}
                    >
                      <Typography level="body-md">
                        {data[level][tooltip.code]["old_parti"]}
                      </Typography>
                      <Divider
                        sx={{ margin: "0 0.25rem" }}
                        orientation="vertical"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography level="body-md">
                          {data[level][tooltip.code]["oldvoix"]}
                        </Typography>
                        <Typography level="body-sm">&nbsp;voix</Typography>
                      </Box>
                      <Divider
                        sx={{ margin: "0 0.25rem" }}
                        orientation="vertical"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography>
                          &nbsp;
                          {data[level][tooltip.code]["oldprc"].toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Divider orientation="vertical" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingTop: "0.25rem",
                      }}
                    >
                      <Typography level="body-md">
                        {data[level][tooltip.code]["new_parti"]}
                      </Typography>
                      <Divider
                        sx={{ margin: "0 0.25rem" }}
                        orientation="vertical"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography level="body-md">
                          {data[level][tooltip.code]["newvoix"]}
                        </Typography>
                        <Typography level="body-sm">&nbsp;voix</Typography>
                      </Box>
                      <Divider
                        sx={{ margin: "0 0.25rem" }}
                        orientation="vertical"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <Typography>
                          &nbsp;
                          {data[level][tooltip.code]["newprc"].toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* <Divider />
                  <PercentageBar
                    value1={data[level][tooltip.code]["oldprc"].toFixed(1)}
                    value2={data[level][tooltip.code]["newprc"].toFixed(1)}
                    value={data[level][tooltip.code]["percent"]}
                  /> */}
                </Box>
              ) : type === "TP" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: "0.25rem",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography level="body-md">
                      {data[level][tooltip.code]["votes"].toLocaleString()}
                    </Typography>
                    <Typography level="body-sm">&nbsp;voix</Typography>
                    <Divider
                      sx={{ margin: "0 0.25rem" }}
                      orientation="vertical"
                    />
                    <Typography level="body-md">
                      {data[level][tooltip.code]["inscrits"].toLocaleString()}
                    </Typography>
                    <Typography level="body-sm">&nbsp;inscrits</Typography>
                    <Divider
                      sx={{ margin: "0 0.25rem" }}
                      orientation="vertical"
                    />
                    <Typography>
                      &nbsp;
                      {data[level][tooltip.code]["tp"].toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              ) : null
            ) : (
              <Typography>Données pas disponibles.</Typography>
            )}
          </Box>
        </Sheet>
      )}
      <Sheet
        sx={{
          width: "26rem",
          height: 500,
          backgroundColor: "#add8e6",
          borderRadius: "1rem",
          marginTop: "0.25rem",
          padding: "0.25rem",
        }}
      >
        <DeckGL
          controller={true}
          initialViewState={viewport}
          layers={layers}
          onViewportChange={(newViewport) => dispatch(setViewport(newViewport))}
        >
          <GeoJsonLayer
            id={"africa"}
            data={custom}
            pickable={false}
            stroked={false}
            filled={currentTarget ? false : true}
            getFillColor={[3, 3, 3, 25]}
          />
        </DeckGL>
      </Sheet>

      <ButtonGroup orientation="vertical" size="sm" sx={{ padding: "0.25rem" }}>
        <Tooltip placement="top" arrow title="Fermer">
          <Button onClick={handleDeleteClick}>
            <CloseIcon />
          </Button>
        </Tooltip>
        <Tooltip placement="top" arrow title="Retour">
          <Button
            disabled={level === levels[0] ? true : false}
            onClick={handleResetClick}
          >
            <UndoIcon />
          </Button>
        </Tooltip>
        {/* <Tooltip placement="top" arrow title="Centrer">
          <Button onClick={handleCenterClick}>
            <CenterFocusStrongIcon />
          </Button>
        </Tooltip> */}
        {/* <Tooltip placement="top" arrow title="Rester sur ce niveau">
          <Button onClick={handleLockChange}>
            {levelLock ? (
              <FileDownloadOffOutlinedIcon />
            ) : (
              <SaveAltOutlinedIcon />
            )}
          </Button>
        </Tooltip> */}
        {/* <Tooltip
          placement="top"
          arrow
          title={`Changer de niveau: ${
            level.charAt(0).toUpperCase() + level.slice(1)
          }`}
        >
          <Button>
            <LayersOutlinedIcon />
          </Button>
        </Tooltip> */}
        <Tooltip placement="top" arrow title="Afficher en graphique">
          <Button onClick={handleGraphButton}>
            <EqualizerOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip placement="top" arrow title="Afficher en tableau">
          <Button onClick={handleTableButton}>
            <TableChart />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default MapComponent;
