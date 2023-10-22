import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import custom from "../../assets/custom(3).json";
import { Box, Button, Divider, Sheet, Typography } from "@mui/joy";
import fullMap from "../../assets/map(18).json";

const MapComponent = ({
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
  toggleLayer,
  classNumber,
  hover,
  setHover,
}) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const centerCoords = [33.9989, 10.1658];

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
    const value = data[level]["prc"][feature.properties[`code_${level}`]];

    if (!value) return "#d3d3d3";

    if (singleValue) return colors[4];
    if (value && displayMode === 1) return getColorForValue(value);
    if (value && displayMode === 2) return getColorForPercentileValue(value);
  };

  const handleClick = (feature, layer) => {
    const code = Number(feature.properties[`code_${level}`]);

    const targetFeature = fullMap.features.find(
      (feature) =>
        feature.properties.level === level &&
        feature.properties[`code_${level}`] === code
    );
    const geometryType = targetFeature.geometry.type;
    let bounds;

    const polygons =
      geometryType === "Polygon"
        ? [targetFeature.geometry.coordinates]
        : targetFeature.geometry.coordinates;

    const latLngs = [];
    for (const polygon of polygons) {
      for (const ring of polygon) {
        latLngs.push(...ring.map((coord) => L.latLng(coord[1], coord[0])));
      }
    }
    bounds = L.latLngBounds(latLngs);

    setTarget(bounds);

    // setTarget(bounds);
    setLevel("delegation");
  };

  const handleResetClick = () => {
    setLevel("gouvernorat");
    setZoomLevel(0);
    setTarget(null);
    mapRef.current.setView(centerCoords, 6);
  };

  const handleMousover = (e) => {
    const { target, layerPoint, latlng } = e;

    const clickedPoint = [latlng.lng, latlng.lat];

    const overlappingFeatures = [];
    fullMap.features.forEach((feature) => {
      if (turf.booleanPointInPolygon(clickedPoint, feature.geometry)) {
        overlappingFeatures.push(feature);
      }
    });

    const code = target.feature.properties[`code_${level}`];
    const name = target.feature.properties[`nom_${level}`];
    setHover(code);
    setTooltipContent({
      name,
      prc: data[level]["prc"][code],
      voix: data[level]["voix"][code],
      gouvernorat:
        level === "gouvernorat"
          ? null
          : target.feature.properties["nom_gouvernorat"],
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

  const getWeightValue = (feature) => {
    if (level === "gouvernorat")
      return feature.properties.level === "gouvernorat" ? 0.8 : 0.1;
    if (level !== "gouvernorat")
      return feature.properties.level === "gouvernorat" ? 5 : 0.5;
  };
  const georef = useRef();
  const [ready, setReady] = useState(false);

  // useEffect(() => {
  //   if (ready) {
  //     georef.current.getContainer().style.setProperty("filter", `blur('20px')`);
  //   }
  // }, [ready]);

  return (
    <Box>
      {tooltipContent && (
        <Sheet
          style={{
            position: "absolute",
            left: tooltipPosition.x,
            transform: "translateX(-25%)",
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
            <Typography>
              {tooltipContent.name}
              {tooltipContent.gouvernorat
                ? ` - ${tooltipContent.gouvernorat}`
                : null}
            </Typography>
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
        // key={target}
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
          key={level}
          ref={georef}
          data={fullMap}
          style={(feature) => ({
            color: "#000",
            dashArray: feature.properties.level === "gouvernorat" ? null : 4,
            // weight:
            //   feature.properties[naming.code] === hover ||
            //   feature.properties.level === "gouvernorat"
            //     ? 1
            //     : 0.1,
            weight:
              feature.properties[`code_${level}`] === hover
                ? getWeightValue(feature) + 1
                : getWeightValue(feature),
            opacity: feature.properties.level === "gouvernorat" ? 1 : 0.5,
            fillColor: getColor(feature),
            //   fillOpacity:
            //     level === "gouvernorat"
            //       ? feature.properties[naming.code] === hover
            //         ? 1.2
            //         : 0.8
            //       : 0,
            fillOpacity: feature.properties.level === level ? 0.9 : 0.1,
            filter: blur("16px"),
          })}
          onEachFeature={onEachFeature}
          whenReady={() => console.log("first")}
        />

        {level !== "gouvernorat" && (
          <Button sx={{ zIndex: 1000 }} onClick={handleResetClick}>
            Retour
          </Button>
        )}
      </MapContainer>
    </Box>
  );
};

export default MapComponent;
