import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import custom from "../../assets/custom(3).json";
import { Box, Button, Divider, Sheet, Typography } from "@mui/joy";
import mapDeletaion from "../../assets/delegation.json";

const MapComponent2 = ({
  naming,
  data,
  geojson,
  level,
  setLevel,
  filter,
  colors,
  colors2,
  displayMode,
  target,
  setTarget,
  toggleLayer,
  classNumber,
  hover,
  setHover,
}) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const [interactive, setInteractive] = useState(true);
  const centerCoords = [33.9989, 10.1658];

  const [targetCode, setTargetCode] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState("delegation");

  const minValueColor = colors[0];
  const maxValueColor = colors[1];

  const [singleValue, setSingleValue] = useState(false);

  // useEffect(() => {
  //   if (Object.keys(data["prc"]).length === 2) setSingleValue(true);
  // }, [data]);
  // console.log(singleValue);

  const [zoomLevel, setZoomLevel] = useState(0);
  const mapRef = useRef(null);

  const values = Object.values(data["prc"]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const singleColorRange = (maxValue - minValue) / classNumber;
  const stepSize = Math.floor(colors.length / classNumber);
  const selectedColors = [];

  for (var i = 0; i < classNumber; i++) {
    var index = i * stepSize;
    selectedColors.push(colors[index]);
  }

  useEffect(() => {
    if (mapRef.current && target && geojson) {
      mapRef.current.whenReady(() => {
        mapRef.current.flyToBounds(target);
      });
    }
  }, [target, geojson]);

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
    // console.log(feature.properties[naming.code]);
    const value = data["prc"][feature.properties[naming.code]];

    if (!value) return "#d3d3d3";

    if (singleValue) return colors[4];

    if (value && displayMode === 1) return getColorForValue(value);
    if (value && displayMode === 2) return getColorForPercentileValue(value);
  };

  const handleDelegationClick = (feature, layer) => {
    const code = Number(feature.properties[naming.code]);
    setTargetCode(code);
    const bounds = layer.getBounds();
    setTarget(bounds);
    setLevel("delegation");
    setInteractive(false);
  };

  const handleResetClick = () => {
    setLevel("gouvernorat");
    setTargetCode(null);
    setZoomLevel(0);
    mapRef.current.setView(centerCoords, 6);
  };

  const handleMousover = (e) => {
    const { target, layerPoint } = e;
    const code = target.feature.properties[naming.code];
    const name = target.feature.properties[naming.name];
    setHover(code);
    setTooltipContent({
      name,
      prc: data["prc"][code],
      voix: data["voix"][code],
    });
    setTooltipPosition(layerPoint);
  };

  const handleMouseout = () => {
    setHover(null);
    setTooltipContent(null);
  };

  const onEachFeature = (feature, layer) => {
    layer.on("click", () => {
      handleDelegationClick(feature, layer);
    });
    if (level === "gouvernorat") {
      layer.on("mouseover", handleMousover);
      layer.on("mouseout", handleMouseout);
    }
  };

  const onEachFeature2 = (feature, layer) => {
    if (level === "delegation") {
      layer.on("mouseover", handleMousover);
      layer.on("mouseout", handleMouseout);
    }
  };

  return (
    <MapContainer
      key={1}
      zoomControl={false}
      boxZoom={false}
      doubleClickZoom={false}
      dragging={false}
      scrollWheelZoom={false}
      ref={mapRef}
      className="map-container "
      center={centerCoords}
      zoom={6}
      maxBounds={[
        [37.624276, 7.177274],
        [30.192062, 12.880537],
      ]}
      noWrap={true}
      style={{
        width: 560,
        height: 520,
        backgroundColor: "#add8e6",
        borderRadius: "1rem",
        marginTop: "0.25rem",
      }}
      attributionControl={false}
    >
      {toggleLayer && (
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      )}

      {!toggleLayer && (
        <GeoJSON
          key={"Africa"}
          data={custom}
          style={{ fillColor: "#333", weight: 0.1, interactive: false }}
        />
      )}

      <GeoJSON
        // data={geojson["delegation"]}
        key={"delegation"}
        data={mapDeletaion}
        style={(feature) => ({
          fillColor: level === "delegation" ? getColor(feature) : null,
          fillOpacity: level === "delegation" ? 0.9 : 0,
          weight: level === "delegation" ? 0.4 : 0.1,
        })}
        onEachFeature={onEachFeature2}
      />

      <GeoJSON
        key={"gouvernorat"}
        data={geojson["gouvernorat"]}
        style={(feature) => ({
          interactive: interactive,
          fillColor: level === "gouvernorat" ? getColor(feature) : null,
          color: "#000",
          weight:
            feature.properties[naming.code] === hover || level === "delegation"
              ? 2
              : 0.5,
          // fillOpacity:
          //   zoomLevel === 0
          //     ? feature.properties[naming.code] === hover
          //       ? 1.2
          //       : 0.8
          //     : 0,
          fillOpacity:
            level === "gouvernorat"
              ? feature.properties[naming.code] === hover
                ? 1.2
                : 0.8
              : 0,
        })}
        // onEachFeature={(feature, layer) => {
        //   layer.on("click", () => {
        //     handleDelegationClick(feature, layer);
        //   });
        //   layer.on({
        //     mouseover: handleMousover,
        //     mouseout: handleMouseout,
        //   });
        // }}
        onEachFeature={onEachFeature}
      />

      {tooltipContent && (
        <Sheet
          style={{
            position: "absolute",
            left: tooltipPosition.x,
            transform: "translateX(-50%)",
            top: tooltipPosition.y - 100,
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

      {level !== "gouvernorat" && (
        <Button sx={{ zIndex: 1000 }} onClick={handleResetClick}>
          Retour
        </Button>
      )}
    </MapContainer>
  );
};

export default MapComponent2;
