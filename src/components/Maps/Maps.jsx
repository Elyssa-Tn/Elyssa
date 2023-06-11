import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import topojson from "../../assets/delegations-full.json";
import "./Maps.css";
import { useState } from "react";

const Maps = () => {
  const elections = [
    {
      Election: "Election 1",
      parties: ["Partie A", "Partie B", "Partie C"],
    },
    {
      Election: "Election 2",
      parties: ["Partie X", "Partie Y", "Partie Z"],
    },
    {
      Election: "Election 3",
      parties: ["Partie M", "Partie N", "Partie O"],
    },
  ];

  const TUNISIA_TOPO_JSON = topojson;

  const [selectedElection, setSelectedElection] = useState([]);

  const [checkedParty, setCheckedParty] = useState(null);

  const handleCheckboxChange = (event) => {
    setCheckedParty(
      event.target.value === checkedParty ? null : event.target.value
    );
  };
  const handleElectionSelection = (event) => {
    setSelectedElection(
      event.Election === selectedElection.Election ? [] : event
    );
  };

  const [position, setPosition] = useState({
    coordinates: [9.925, 33.793],
    zoom: 1,
  });

  const projectionConfig = {
    scale: 6000,
    center: [9.925, 33.793],
  };

  const handleClick = (geo) => {
    console.log(geo.properties);
  };

  const handleRecenter = () => {
    setPosition({
      coordinates: projectionConfig.center,
      zoom: 1,
    });
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  };

  const handleMoveEnd = (position) => {
    setPosition({
      coordinates: [
        Math.max(4, Math.min(16, position.coordinates[0])),
        Math.max(36, Math.min(40, position.coordinates[1])),
      ],
      zoom: position.zoom,
    });
  };

  const randomColor = () => {
    const hue = (1 - (Math.random() * 100) / 100) * 120;
    const saturation = "100%";
    const lightness = "50%";
    const color = `hsl(${hue}, ${saturation}, ${lightness})`;

    return color;
  };

  return (
    <div>
      <h2>Carte Graphique</h2>
      <div className="maps-page-container">
        <div className="selection-menu-container">
          {elections.map((election) => (
            <div key={election.Election}>
              <button onClick={() => handleElectionSelection(election)}>
                {election.Election}
              </button>
              {election.Election === selectedElection.Election && (
                <ul>
                  {election.parties.map((party) => (
                    <label key={party}>
                      <input
                        type="checkbox"
                        value={party}
                        checked={checkedParty === party}
                        onChange={handleCheckboxChange}
                      />
                      {party}
                    </label>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="map-container">
          <ComposableMap
            style={{ width: "400px", height: "600px" }}
            projectionConfig={projectionConfig}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
            >
              <Geographies geography={TUNISIA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={checkedParty ? randomColor() : "#0"}
                      stroke="#ccc"
                      onClick={() => handleClick(geo)}
                    />
                  ))
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
          <div className="map-controls">
            <button onClick={handleZoomIn}>+</button>
            <button onClick={handleZoomOut}>-</button>
            <button onClick={handleRecenter}>
              <LocationSearchingIcon />
            </button>
          </div>
        </div>
        <div className="commentary-container">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione
            dicta quas quam consectetur vel dolor. Officiis ipsam quae saepe
            odit sunt dignissimos quis, explicabo iure illo. Id excepturi
            officia facilis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maps;
