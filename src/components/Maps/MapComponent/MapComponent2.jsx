import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useState } from "react";

import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Button, Menu, MenuItem } from "@mui/material";
import MapLevelSelection from "./MapLevelSelection/MapLevelSelection";
import Tooltip from "leaflet-tooltip";

const MapComponent2 = ({ naming, data, geojson, level, setLevel }) => {
  const [selectedDelegation, setSelectedDelegation] = useState(null);
  const mapRef = useRef(null);

  const values = Object.values(data);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const pickColorInRange = (value, minValue, maxValue) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);

    const red = Math.round(255 * normalizedValue);
    const green = Math.round(255 * (1 - normalizedValue));
    const blue = 0;

    const color = `#${red.toString(16).padStart(2, "0")}${green
      .toString(16)
      .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

    return color;
  };

  const getColor = (feature) => {
    const value = data[Number(feature.properties[naming.code])];

    if (value) return pickColorInRange(value, minValue, maxValue);

    return feature.properties.deleg_na_1 === selectedDelegation
      ? "red"
      : "blue";
  };

  const handleDelegationClick = (feature) => {
    console.log(feature);
    const delegation = Number(feature.properties[naming.code]);
    setSelectedDelegation(delegation);
    if (delegation) {
      const { coordinates } = feature.geometry;
      const bounds = coordinates[0].map(([lon, lat]) => [lat, lon]);
      mapRef.current.flyToBounds(bounds);
    }
  };

  return (
    <MapContainer
      ref={mapRef}
      className="map-container "
      center={[33.9989, 10.1658]}
      zoom={6}
      maxZoom={19}
      minZoom={6}
      maxBounds={[
        [37.624276, 7.177274],
        [30.192062, 12.880537],
      ]}
      noWrap={true}
      style={{ width: 360, height: 400 }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GeoJSON
        data={geojson}
        style={(feature) => ({
          color: getColor(feature),
          weight: 1,
        })}
        onEachFeature={(feature, layer) => {
          layer.on("click", () => handleDelegationClick(feature));
          layer.bindTooltip(feature.properties[naming.name], {
            permanent: false,
            direction: "top",
            classname: "map-tooltip",
          });
        }}
      />
      <MapLevelSelection level={level} setLevel={setLevel} />
    </MapContainer>
  );
};

export default MapComponent2;
