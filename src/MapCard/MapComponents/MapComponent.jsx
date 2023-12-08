import UndoIcon from "@mui/icons-material/Undo";
import SaveAltOutlinedIcon from "@mui/icons-material/SaveAltOutlined";
import FileDownloadOffOutlinedIcon from "@mui/icons-material/FileDownloadOffOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { useState } from "react";
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
  setTooltip,
  setViewport,
} from "../../reducers/interfaceReducer";
import { DeckGL, GeoJsonLayer, WebMercatorViewport } from "deck.gl";

const MapComponent = ({
  ID,
  data,
  type,
  geojson,
  colors,
  colors2,
  displayMode,
  bounds,
}) => {
  const target = useSelector((state) => state.interface.target);
  const level = useSelector((state) => state.interface.level);
  const levels = useSelector((state) => state.interface.levels);
  const viewport = useSelector((state) => state.interface.viewport);
  const hover = useSelector((state) => state.interface.hover);
  const tooltip = useSelector((state) => state.interface.tooltip);
  const zoomLevel = useSelector((state) => state.interface.zoomLevel);
  const levelLock = useSelector((state) => state.interface.levelLock[ID]);

  const compare = useSelector((state) => state.interface.compareToggle);

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

  // useEffect(() => {
  //   if (Object.keys(data["prc"]).length === 2) setSingleValue(true);
  // }, [data]);
  // console.log(singleValue);

  const singleColorRange = (max - min) / classNumber;
  const stepSize = Math.floor(colors.length / classNumber);

  const selectedColors = [];

  for (var i = 0; i < classNumber; i++) {
    var index = i * stepSize;
    selectedColors.push(colors[index]);
  }

  const getColorOnScale = (value) => {
    const factor = (value - min) / (max - min);
    const color = [255 * (1 - factor), 255 * factor, 0, 255];
    return color;
  };

  function getColorForPercentileValue(value) {
    const color1 = colors2[0];
    const color2 = colors2[1];
    const factor = value / 100;
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `rgb(${r}, ${g}, ${b})`;
  }

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

    if (type === "evolution") {
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
              ? type === "simple"
                ? data[level][code]["prc"]
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

  const handleClick = (object) => {
    handleMouseout();
    const code = object.properties[`code_${level}`];
    dispatch(setCurrentTarget(code));

    const { _southWest, _northEast } = bounds[level][code].bounds;

    const boundaries = [
      [_southWest.lng, _southWest.lat],
      [_northEast.lng, _northEast.lat],
    ];

    const viewportWebMercator = new WebMercatorViewport(viewport);

    const { longitude, latitude, zoom } = viewportWebMercator.fitBounds(
      boundaries,
      { width: 408, height: 500 }
    );
    // console.log(ID, levelLock);
    if (!levelLock) {
      dispatch(setLevel(levels[1]));
    }

    dispatch(
      setViewport({
        ...viewport,
        latitude,
        longitude,
        zoom,
      })
    );
    // dispatch(setClickedTarget(boundaries));
  };

  const layers = Object.keys(geojson)
    .reverse()
    .map((mapLevel, index) => {
      const data = geojson[mapLevel];

      //TODO: A BETTER WAY TO DISPLAY TARGETED subsections on level change

      return new GeoJsonLayer({
        key: mapLevel,
        id: mapLevel,
        data,
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
            top: tooltip.position.y - 50,
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
            {tooltip.prc ? (
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
                    {type === "simple"
                      ? data[level][tooltip.code]["voix"]
                      : data[level][tooltip.code]["newvoix"] -
                        data[level][tooltip.code]["oldvoix"]}
                  </Typography>
                  <Typography level="body-sm">&nbsp;voix</Typography>
                </Box>
                <Divider sx={{ margin: "0 0.25rem" }} orientation="vertical" />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography
                    style={{
                      background: rgbaToCssString(
                        type === "simple"
                          ? getColorForValue(data[level][tooltip.code]["prc"])
                          : getColorOnScale(
                              data[level][tooltip.code]["percent"]
                            )
                      ),
                      width: "1.5rem",
                      height: "1.5rem",
                      border: "1px solid #333",
                    }}
                  ></Typography>
                  <Typography>
                    &nbsp;
                    {type === "simple"
                      ? data[level][tooltip.code]["prc"].toFixed(2)
                      : data[level][tooltip.code]["percent"]}
                    %
                  </Typography>
                </Box>
              </Box>
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
            filled={true}
            getFillColor={[3, 3, 3, 25]}
          />
        </DeckGL>
      </Sheet>

      <ButtonGroup orientation="vertical" size="sm" sx={{ padding: "0.25rem" }}>
        <Tooltip placement="top" arrow title="Retour">
          <Button
            disabled={level === levels[0] ? true : false}
            onClick={handleResetClick}
          >
            <UndoIcon />
          </Button>
        </Tooltip>
        <Tooltip placement="top" arrow title="Rester sur ce niveau">
          <Button onClick={handleLockChange}>
            {levelLock ? (
              <FileDownloadOffOutlinedIcon />
            ) : (
              <SaveAltOutlinedIcon />
            )}
          </Button>
        </Tooltip>
        <Tooltip
          placement="top"
          arrow
          title={`Changer de niveau: ${
            level.charAt(0).toUpperCase() + level.slice(1)
          }`}
        >
          <Button>
            <LayersOutlinedIcon />
          </Button>
        </Tooltip>
        <Tooltip placement="top" arrow title="Afficher en graphique">
          <Button onClick={handleGraphButton}>
            <EqualizerOutlinedIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default MapComponent;
