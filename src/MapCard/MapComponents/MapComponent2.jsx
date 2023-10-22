import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import custom from "../../assets/custom(3).json";
import { Box, Button, Divider, Sheet, Typography } from "@mui/joy";
// import mapDeletaion from "../../assets/delegation.json";

const MapComponent2 = ({
  naming,
  data,
  geojson,
  level,
  setLevel,
  colors,
  colors2,
  displayMode,
  target,
  setTarget,
  classNumber,
  hover,
  setHover,
}) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [interactive, setInteractive] = useState(true);
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

  const values = Object.values(data[level]["prc"]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const singleColorRange = (maxValue - minValue) / classNumber;
  const stepSize = Math.floor(colors.length / classNumber);
  const selectedColors = [];

  for (var i = 0; i < classNumber; i++) {
    var index = i * stepSize;
    selectedColors.push(colors[index]);
  }

  useLayoutEffect(() => {
    const allRefsReady = geoJSONRefs.every((ref) => ref.current !== null);
    if (allRefsReady && mapRef.current && target) {
      setTimeout(() => {
        mapRef.current.flyToBounds(target, { animate: true });
        setTarget(null);
      }, 0);
    }
  }, [geoJSONRefs, mapRef, setTarget, target]);

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
    const interval = Math.floor((value - minValue) / singleColorRange);
    return selectedColors[Math.min(interval, classNumber - 1)];
  };

  const getColor = (feature) => {
    const value = data[level]["prc"][feature.properties[`code_${level}`]];

    if (!value) return "#d3d3d3";

    if (singleValue) return colors[4];

    if (value && displayMode === 1) return getColorForValue(value);
    if (value && displayMode === 2) return getColorForPercentileValue(value);
  };

  const handleClick = (feature, layer) => {
    const code = Number(feature.properties[`code_${level}`]);
    setTargetCode(code);
    const bounds = layer.getBounds();
    setLevel("delegation");
    setTarget(bounds);
    setInteractive(false);
  };

  const handleResetClick = () => {
    setLevel("gouvernorat");
    setTargetCode(null);
    mapRef.current.setView(centerCoords, 6);
    setInteractive(true);
  };

  const handleMousover = (e) => {
    const { target, layerPoint } = e;
    const code = target.feature.properties[`code_${level}`];
    const name = target.feature.properties[`nom_${level}`];
    setHover(code);
    setTooltipContent({
      name,
      prc: data[level]["prc"][code],
      voix: data[level]["voix"][code],
    });
    setTooltipPosition(layerPoint);
  };

  const handleMouseout = () => {
    setHover(null);
    setTooltipContent(null);
  };

  const onEachFeature = (feature, layer) => {
    layer.on("click", () => {
      handleClick(feature, layer);
    });

    layer.on("mouseover", handleMousover);
    layer.on("mouseout", handleMouseout);
  };

  return (
    <Box>
      {tooltipContent && (
        <Sheet
          style={{
            position: "absolute",
            left: tooltipPosition.x,
            top: tooltipPosition.y - 50,
            borderRadius: "0.25rem",
            padding: "0.25rem",
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0.25rem",
            }}
          >
            <Typography>{tooltipContent.name}</Typography>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography>{tooltipContent.voix} voix</Typography>
              <Divider sx={{ margin: "0 0.25rem" }} orientation="vertical" />
              <Typography
                style={{
                  background: getColorForValue(tooltipContent.prc),
                  width: "1.5rem",
                  height: "1.5rem",
                  border: "1px solid #fff",
                }}
              ></Typography>
              <Typography>{tooltipContent.prc}%</Typography>
            </Box>
          </Box>
        </Sheet>
      )}
      <MapContainer
        key={level}
        zoomControl={false}
        boxZoom={false}
        doubleClickZoom={false}
        dragging={false}
        scrollWheelZoom={false}
        ref={mapRef}
        center={centerCoords}
        zoom={6}
        maxBounds={[
          [37.624276, 7.177274],
          [30.192062, 12.880537],
        ]}
        noWrap={true}
        style={{
          width: 480,
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
                fillOpacity: feature.properties.level === level ? 0.8 : 0,
                weight: 0.4 + index,
                color: "#000",
              })}
              onEachFeature={onEachFeature}
              interactive={key === level ? true : false}
              ref={geoJSONRefs[index]}
            />
          ))}

        {level !== "gouvernorat" && (
          <Button sx={{ zIndex: 1000 }} onClick={handleResetClick}>
            Retour
          </Button>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapComponent2;
