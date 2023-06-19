import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import { useEffect, useState } from "react";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Button, Menu, MenuItem } from "@mui/material";
import Mapinfo from "./MapInfo/Mapinfo";

export const MapComponent = ({ topojson, data, separation }) => {
  const colorMap = {
    chomage: {
      min: 5,
      max: 15,
    },
    analphabetisme: {
      min: 3,
      max: 8,
    },
    age_moyen: {
      min: 25,
      max: 35,
    },
  };

  const [level, setLevel] = useState("Delegation");
  const [title, setTitle] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  useEffect(() => {
    setTitle(
      typeof data === "string"
        ? data === "blank"
          ? null
          : data
        : `${data.type} - ${data.election} : ${data.partie}`
    );
  }, [data]);

  const colorPicker = (properties) => {
    const gov = properties.gov_name_f;
    const circ = properties.circo_na_1;
    const deleg = properties.deleg_na_1;
    if (typeof data === "string") {
      switch (level) {
        case "Gouvernorat":
          return pickColorInRange(
            findGovernoratValue(gov, data),
            colorMap[data].min,
            colorMap[data].max
          );
        case "Circonférence":
          return pickColorInRange(
            findCircumferenceValue(circ, data),
            colorMap[data].min,
            colorMap[data].max
          );
        case "Delegation":
          return pickColorInRange(
            findDelegationValue(deleg, data),
            colorMap[data].min,
            colorMap[data].max
          );
        default:
          return "#fff";
      }
    }
    if (typeof data === "object") {
      let result = findDelegationElectionValue(deleg, data);
      if (result) {
        return pickColorInRange(result[data.election][data.partie], 100, 1);
      }
      // return pickColorInRange(
      //   findGovernoratValue(gov, data),
      //   colorMap[data].min,
      //   colorMap[data].max
      // );
    }
  };

  const findDelegationElectionValue = (name, target) => {
    for (const region of Object.values(separation)) {
      for (const subRegion of Object.values(region)) {
        for (const entry of subRegion) {
          if (entry.name === name) {
            return entry["elections"]["elections"][target.type].find((obj) =>
              obj.hasOwnProperty(target.election)
            );
          }
        }
      }
    }
  };

  const findDelegationValue = (name, target) => {
    for (const region of Object.values(separation)) {
      for (const subRegion of Object.values(region)) {
        for (const entry of subRegion) {
          if (entry.name === name) {
            return entry[target];
          }
        }
      }
    }
  };

  const findCircumferenceValue = (name, target) => {
    for (const region of Object.values(separation)) {
      if (Object.keys(region).includes(name)) {
        return region[name][region[name].length - 1]["moyenne_regionale"][
          target
        ];
      }
    }
  };

  const findGovernoratValue = (name, target) => {
    let result = 0;
    for (const region of Object.values(separation[name]))
      result += region[region.length - 1]["moyenne_regionale"][target];

    return result / Object.keys(separation[name]).length;
  };

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

  const [position, setPosition] = useState({
    coordinates: [9.925, 33.793],
    zoom: 1,
  });

  const projectionConfig = {
    scale: 6000,
    center: [9.925, 33.793],
  };

  const reposition = (geo, projection, path) => {
    const centroid = projection.invert(path.centroid(geo));
    const newPos = {
      coordinates: centroid,
      zoom: 12,
    };
    setPosition(newPos);
  };

  const handleClick = (geo, projection, path) => {
    reposition(geo, projection, path);

    if (data != "blank") {
      const locationData = {
        Delegation: geo.properties.deleg_na_1,
        Circonférence: geo.properties.circo_na_1,
        Gouvernorat: geo.properties.gov_name_f,
        Chomage: findDelegationValue(geo.properties.deleg_na_1, "chomage"),
        Analphabetisme: findDelegationValue(
          geo.properties.deleg_na_1,
          "analphabetisme"
        ),
        "Moyenne D'age": findDelegationValue(
          geo.properties.deleg_na_1,
          "age_moyen"
        ),
      };
      setSelectedDivision(locationData);
    }

    // console.log(`Circo: ${geo.properties.circo_na_1}`);
    // console.log(`Delegation: ${geo.properties.deleg_na_1}`);
    // console.log(`Gouvernorat: ${geo.properties.gov_name_f}`);
  };

  const handleRecenter = () => {
    setPosition({
      coordinates: projectionConfig.center,
      zoom: 1,
    });
  };

  const handleZoomIn = () => {
    // if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom + 2 }));
    console.log(position.zoom);
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = (position) => {
    // setPosition({
    //   coordinates: [
    //     Math.max(4, Math.min(16, position.coordinates[0])),
    //     Math.max(36, Math.min(40, position.coordinates[1])),
    //   ],
    //   zoom: position.zoom,
    // });
    // console.log(position);
  };

  const handleLevelChange = (popupState, level) => {
    popupState.close();
    setLevel(level);
  };

  return (
    <div className="map-container">
      <div className="map-title">
        <span>{title}</span>
      </div>
      <ComposableMap
        style={{ width: "400px", height: "500px", borderRadius: "25px" }}
        projectionConfig={projectionConfig}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={topojson}>
            {({ geographies, projection, path }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        stroke: "#ccc",
                        fill:
                          data === "blank"
                            ? "#fff"
                            : colorPicker(geo.properties),
                      },
                      hover: { fill: data === "blank" ? "#ccc" : "#ccc" },
                    }}
                    stroke="#ccc"
                    strokeWidth={
                      level === "Delegation" || data === "blank" ? 0.5 : 0.1
                    }
                    onClick={() => handleClick(geo, projection, path)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <div className="map-buttons">
        <div className="map-controls">
          <button onClick={handleZoomIn}>+</button>
          <button onClick={handleZoomOut}>-</button>
          <button onClick={handleRecenter}>
            <LocationSearchingIcon />
          </button>
        </div>
        <div className="level-selection-button">
          {" "}
          <PopupState variant="popover" popupId="demoMenu">
            {(popupState) => (
              <div>
                <Button variant="contained" {...bindTrigger(popupState)}>
                  {level}
                </Button>
                <Menu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem
                    onClick={() => handleLevelChange(popupState, "Delegation")}
                  >
                    Delegation
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleLevelChange(popupState, "Circonférence")
                    }
                  >
                    Circonférence
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleLevelChange(popupState, "Gouvernorat")}
                  >
                    Gouvernorat
                  </MenuItem>
                </Menu>
              </div>
            )}
          </PopupState>
        </div>
      </div>
      {selectedDivision && <Mapinfo selectedDivision={selectedDivision} />}
    </div>
  );
};
