import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import UndoIcon from "@mui/icons-material/Undo";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import custom from "../../assets/custom(3).json";
import { Box, Button, ButtonGroup, Divider, Sheet, Typography } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import {
  setClickedTarget,
  setHover,
  setLevel,
  setTooltip,
  setZoomLevel,
} from "../../reducers/interfaceReducer";

const MapComponent2 = ({
  ID,
  data,
  geojson,
  colors,
  colors2,
  displayMode,
  bounds,
}) => {
  const target = useSelector((state) => state.interface.target);
  const level = useSelector((state) => state.interface.level);
  const levels = useSelector((state) => state.interface.levels);
  const hover = useSelector((state) => state.interface.hover);
  const tooltip = useSelector((state) => state.interface.tooltip);
  const zoomLevel = useSelector((state) => state.interface.zoomLevel);

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

  // const { min, max } = values;

  const dispatch = useDispatch();

  const [ready, setReady] = useState(false);
  const centerCoords = [33.9989, 10.1658];

  const [targetCode, setTargetCode] = useState(null);

  const minValueColor = colors[0];
  const maxValueColor = colors[1];

  const [singleValue, setSingleValue] = useState(false);

  // useEffect(() => {
  //   if (Object.keys(data["prc"]).length === 2) setSingleValue(true);
  // }, [data]);
  // console.log(singleValue);

  const mapRef = useRef(null);
  const geoJSONRefs = Object.keys(geojson)
    .reverse()
    .map(() => useRef());

  const singleColorRange = (max - min) / classNumber;
  const stepSize = Math.floor(colors.length / classNumber);

  const selectedColors = [];

  for (var i = 0; i < classNumber; i++) {
    var index = i * stepSize;
    selectedColors.push(colors[index]);
  }

  useLayoutEffect(() => {
    const allRefsReady = geoJSONRefs.every((ref) => ref.current !== null);
    if (allRefsReady && mapRef.current && target) {
      mapRef.current.flyToBounds(target, { animate: ID === 1 ? true : false });
      dispatch(setClickedTarget(null));
    }
  }, [geoJSONRefs, target]);

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

  const getColor = (feature) => {
    const value = data[level]["prc"][feature.properties[`code_${level}`]];

    if (!value) return "#d3d3d3";

    if (singleValue) return colors[4];

    if (value && displayMode === 1) return getColorForValue(value);
    if (value && displayMode === 2) return getColorForPercentileValue(value);
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

  const handleClick = (feature) => {
    const code = Number(feature.properties[`code_${level}`]);

    if (level === levels[0]) {
      const { _southWest, _northEast } = bounds[level][code];

      const boundaries = [
        [_southWest.lat, _southWest.lng],
        [_northEast.lat, _northEast.lng],
      ];

      setTargetCode(code);
      dispatch(setLevel(levels[1]));
      dispatch(setClickedTarget(boundaries));
    }
    if (level === levels[1]) {
      const targetGovCode = Number(
        feature.properties[`code_${getDifferentLevel(levels, level, "up")}`]
      );
      console.log(
        "target code:",
        targetCode,
        "target gov code:",
        targetGovCode
      );

      console.log(targetCode === targetGovCode);

      if (targetCode === targetGovCode) {
        const { _southWest, _northEast } = bounds[level][code];

        const boundaries = [
          [_southWest.lat, _southWest.lng],
          [_northEast.lat, _northEast.lng],
        ];
        dispatch(setClickedTarget(boundaries));
      } else {
        const { _southWest, _northEast } =
          bounds[getDifferentLevel(levels, level, "up")][targetGovCode];

        const boundaries = [
          [_southWest.lat, _southWest.lng],
          [_northEast.lat, _northEast.lng],
        ];

        console.log(`Old code: ${targetCode}. New code: ${targetGovCode}`);

        setTargetCode(null);
        setTimeout(() => {
          setTargetCode(targetGovCode);
        }, 1);
        dispatch(setClickedTarget(boundaries));
      }
    }
  };

  useEffect(() => {
    console.log(targetCode);
  }, [targetCode]);

  const handleResetClick = () => {
    dispatch(setLevel(levels[0]));
    setTargetCode(null);
    dispatch(setClickedTarget(null));
    mapRef.current.setView(centerCoords, 6);
  };

  const handleMousover = (e) => {
    const { target, containerPoint } = e;
    const { x, y } = containerPoint;

    const code = target.feature.properties[`code_${level}`];
    const name = target.feature.properties[`nom_${level}`];
    // const valueGov =
    //   data["gouvernorat"]["prc"][target.feature.properties["code_gouvernorat"]];
    const nomGov = target.feature.properties["nom_gouvernorat"];
    dispatch(setHover(code));
    dispatch(
      setTooltip({
        position: { x, y },
        name,
        gouvernorat: {
          name: nomGov,
          // value: valueGov,
        },
        code,
        prc: data[level]["prc"][code],
        voix: data[level]["voix"][code],
      })
    );
  };

  const handleMouseout = () => {
    dispatch(setHover(null));
    dispatch(setTooltip(null));
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        handleClick(feature, layer);
      },
      mouseover: (e) => {
        handleMousover(e);
      },
      mouseout: () => {
        handleMouseout();
      },
    });
  };

  const getMapZoom = () => {
    return mapRef && console.log("object", mapRef.current.getZoom());
  };

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
                  {data[level]["voix"][tooltip.code]}
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
                {" "}
                <Typography
                  style={{
                    background: getColorForValue(
                      data[level]["prc"][tooltip.code]
                    ),
                    width: "1.5rem",
                    height: "1.5rem",
                    border: "1px solid #333",
                  }}
                ></Typography>
                <Typography>
                  &nbsp;{data[level]["prc"][tooltip.code]}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Sheet>
      )}
      <MapContainer
        key={`${level}${ID}`}
        zoomControl={false}
        // boxZoom={false}
        doubleClickZoom={false}
        // dragging={false}
        // scrollWheelZoom={false}
        ref={mapRef}
        center={centerCoords}
        zoom={zoomLevel}
        minZoom={6}
        zoomSnap={1}
        bounceAtZoomLimits={true}
        maxBounds={[
          [37.624276, 7.177274],
          [30.192062, 12.880537],
        ]}
        noWrap={true}
        style={{
          width: "26rem",
          height: 500,
          backgroundColor: "#add8e6",
          borderRadius: "1rem",
          marginTop: "0.25rem",
        }}
        attributionControl={false}
      >
        <GeoJSON
          key={"Africa"}
          data={custom}
          style={{ fillColor: "#333", weight: 0.1, interactive: false }}
        />

        {Object.keys(geojson)
          .reverse()
          .map((key, index) => (
            <GeoJSON
              key={key}
              data={geojson[key]}
              style={(feature) => ({
                fillColor: getColor(feature),
                fillOpacity:
                  (feature.properties.level === level ? 0.8 : 0) +
                  (feature.properties[`code_${level}`] === hover ? 0.4 : 0),
                weight:
                  0.4 +
                  index +
                  (feature.properties[`code_${level}`] === hover ? 2 : 0),
                color: "#000",
              })}
              onEachFeature={onEachFeature}
              interactive={key === level ? true : false}
              ref={geoJSONRefs[index]}
            />
          ))}
      </MapContainer>
      <ButtonGroup
        orientation="vertical"
        size="sm"
        sx={{ paddingTop: "0.25rem" }}
      >
        <Button
          disabled={level === levels[0] ? true : false}
          onClick={handleResetClick}
        >
          <UndoIcon />
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default MapComponent2;
