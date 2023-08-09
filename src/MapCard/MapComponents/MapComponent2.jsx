import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

const FeatureTooltip = ({ feature }) => {
  return (
    <Tooltip direction="top" offset={[0, -10]}>
      <div>tes</div>
    </Tooltip>
  );
};

const MapComponent2 = ({
  naming,
  data,
  geojson,
  level,
  setLevel,
  target,
  filter,
  colors,
  colors2,
  displayMode,
}) => {
  // const MapComponent2 = ({ naming, data, level, target, filter }) => {
  const [tooltipContent, setTooltipContent] = useState(null);

  const [selectedDelegation, setSelectedDelegation] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState("delegation");

  const minValueColor = colors[0];
  const maxValueColor = colors[1];

  const [singleValue, setSingleValue] = useState(false);

  useEffect(() => {
    if (Object.keys(data).length === 2) setSingleValue(true);
  }, [data]);

  const mapFiles = {
    secteur: "../../assets/secteurs-2022.json",
    commune: "../../assets/commune.json",
    delegation: "../../assets/delegation.json",
    // circonscription: (electioncode) =>
    //   electioncode === "tnleg2022"
    //     ? import("../../assets/circonscription2022.json")
    //     : import("../../assets/circonscription2011-2019.json"),
    circonscription: "../../assets/commune.json",
    gouvernorat: "../../assets/gouvernorat.json",
  };

  const [zoomLevel, setZoomLevel] = useState(6);
  const mapRef = useRef(null);

  const values = Object.values(data);
  const minValue = Math.min(...values);
  // const minValue = 0.1;
  const maxValue = Math.max(...values);
  // const maxValue = 100;
  const singleColorRange = (maxValue - minValue) / 5;

  // const pickColorInRange = (value, minValue, maxValue) => {
  //   const normalizedValue = (value - minValue) / (maxValue - minValue);

  //   const red = Math.round(255 * normalizedValue);
  //   const green = Math.round(255 * (1 - normalizedValue));
  //   const blue = 0;

  //   const color = `#${red.toString(16).padStart(2, "0")}${green
  //     .toString(16)
  //     .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  //   return color;
  // };

  useEffect(() => {
    if (mapRef.current && target) {
      mapRef.current.whenReady(() => {
        mapRef.current.flyToBounds(target);
      });
    }
  }, [target]);

  // useEffect(() => {
  //   console.log(geojson);
  // }, [geojson]);

  // const getColorForPercentileValue = (value) => {
  //   if (value >= 50) {
  //     const red = 189 + ((value - 50) * (253 - 189)) / 50;
  //     const green = 0 + ((value - 50) * (141 - 0)) / 50;
  //     const blue = 38 + ((value - 50) * (60 - 38)) / 50;
  //     return `rgb(${red}, ${green}, ${blue})`;
  //   } else {
  //     const red = 253 + ((value - 0) * (255 - 253)) / 50;
  //     const green = 141 + ((value - 0) * (255 - 141)) / 50;
  //     const blue = 60 + ((value - 0) * (178 - 60)) / 50;
  //     return `rgb(${red}, ${green}, ${blue})`;
  //   }
  // };

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
    return colors[Math.min(interval, 4)];
  };

  const getColor = (feature) => {
    const value = data[Number(feature.properties[naming.code])];

    if (!value) return "#d3d3d3";

    if (singleValue) return colors[4];

    if (value && displayMode === 1) return getColorForValue(value);
    if (value && displayMode === 2) return getColorForPercentileValue(value);
  };

  const handleDelegationClick = (feature, layer) => {
    const delegation = Number(feature.properties[naming.code]);
    setSelectedDelegation(delegation);
    // setTarget(delegation);
    const bounds = layer.getBounds();
    mapRef.current.flyToBounds(bounds);
    // setLevel("circonscription");
    // if (delegation && level === "sector") {
    //   mapRef.current.flyToBounds(bounds);
    // }
    // if (delegation) {
    //   filter({ bounds, delegation });
    // }
  };

  const onEachFeature = (feature, layer) => {
    layer.bindTooltip(tooltipContent, {
      className: "custom-tooltip",
      permanent: true,
      direction: "top",
    });

    layer.on({
      click: () => {
        handleDelegationClick(feature);
      },
      mouseover: (e) => {
        const properties = e.target.feature.properties;
        const content = <div>{properties.name}</div>;
        // you can generate the content of tooltip dynamically based on the properties of the hovered feature

        const tooltipInstance = e.target.getTooltip();
        tooltipInstance.setContent(content);
        tooltipInstance.update();
      },
      mouseout: (e) => {
        // reset the tooltip content when the mouse moves away from the feature
        const tooltipInstance = e.target.getTooltip();
        tooltipInstance.setContent(tooltipContent);
        tooltipInstance.update();
      },
    });
  };

  const formatTooltip = (feature) => {
    return `${feature.properties[naming.name]}: ${
      data[Number(feature.properties[naming.code])]
        ? data[Number(feature.properties[naming.code])]
        : 0
    }`;
  };

  const handleZoomEnd = (event) => {
    const newZoomLevel = event.target.getZoom();
    setZoomLevel(newZoomLevel);

    // Switch GeoJSON based on zoom level
    if (newZoomLevel >= 10 && newZoomLevel < 15) {
      setSelectedDivision("division1");
    } else if (newZoomLevel >= 15) {
      setSelectedDivision("division2");
    }
    // Add more conditions for other zoom levels and divisions as needed
  };

  return (
    <MapContainer
      ref={mapRef}
      className="map-container "
      center={[33.9989, 10.1658]}
      // zoom={6}
      zoom={zoomLevel}
      onZoomend={handleZoomEnd}
      maxZoom={19}
      minZoom={6}
      maxBounds={[
        [37.624276, 7.177274],
        [30.192062, 12.880537],
      ]}
      noWrap={true}
      style={{
        width: 340,
        height: 480,
        backgroundColor: "#add8e6",
        left: "84px",
      }}
      attributionControl={false}
    >
      {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
      {/* <TileLayer url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png" /> */}
      {/* <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png" /> */}

      <GeoJSON
        data={geojson}
        // data={mapFiles[selectedDivision]}
        style={(feature) => ({
          fillColor: getColor(feature),
          color: "#000",
          weight: 0.5,
          fillOpacity: 0.9,
        })}
        // onEachFeature={onEachFeature}
        // onEachFeature={(feature, layer) => {
        //   layer.on({
        // click: () => {
        //   handleDelegationClick(feature);
        // },
        //     mouseover: () => {
        //       layer.openTooltip();
        //     },
        //   });
        //   layer.bindTooltip(<FeatureTooltip properties={feature.properties} />);
        // }}
        onEachFeature={(feature, layer) => {
          // layer.on("click", (e) => {
          //   var bounds = layer.getBounds();
          //   mapRef.current.flyToBounds(bounds);
          // });
          layer.on("click", () => {
            handleDelegationClick(feature, layer);
          }),
            layer.bindTooltip(formatTooltip(feature), {
              permanent: false,
              direction: "top",
              classname: "map-tooltip",
            });
        }}
      />

      {/* <Legend maxValue={maxValue} minValue={minValue} /> */}
      {/* <MapLevelSelection level={level} setLevel={setLevel} /> */}
    </MapContainer>
  );
};

export default MapComponent2;
