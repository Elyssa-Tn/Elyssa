import topojson from "../../assets/delegations-full.json";
import separation from "../../assets/example.json";
import "./Maps.css";
import { useState } from "react";
import { MapComponent } from "./MapComponent/MapComponent";
import { useEffect } from "react";
import SelectionMenu from "./SelectionMenu/SelectionMenu";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";

const Maps = () => {
  const [mapList, setMapList] = useState(["blank"]); //Ou "age_moyen" ou "analphabetisme" ou "chomage"

  const elections = [
    {
      type: "Presidentielle",
      elections: [
        {
          Election: "Election 1",
          parties: ["Candidat A", "Candidat B", "Candidat C"],
        },
        {
          Election: "Election 2",
          parties: ["Candidat A", "Candidat B", "Candidat C"],
        },
      ],
    },
    {
      type: "Legislative",
      elections: [
        {
          Election: "Election 1",
          parties: ["Partie A", "Partie B", "Partie C"],
        },
        {
          Election: "Election 2",
          parties: ["Partie A", "Partie B", "Partie C"],
        },
      ],
    },
  ];

  const TUNISIA_TOPO_JSON = topojson;

  const removeMap = (map) => {
    let state = [...mapList];
    state.splice(state.indexOf(map), 1);
    if (state.length === 0) {
      setMapList(["blank"]);
      return;
    }
    setMapList(state);
  };

  function replaceSpecificNumber(jsonData, numberToReplace) {
    // Recursive function to traverse the JSON object
    function traverse(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object") {
            traverse(obj[key]); // Recursively traverse nested objects
          } else if (
            typeof obj[key] === "number" &&
            obj[key] === numberToReplace
          ) {
            obj[key] = getRandomNumber(); // Replace the specific number with a random one
          }
        }
      }
    }

    // Generate a new random number between 1 and 99, excluding numbers already used
    function getRandomNumber() {
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * 99) + 1;
      } while (usedNumbers.has(randomNum));
      usedNumbers.add(randomNum);
      return randomNum;
    }

    // Create a deep copy of the JSON object
    const updatedData = JSON.parse(JSON.stringify(jsonData));

    // Set to keep track of used numbers
    const usedNumbers = new Set();

    // Traverse the copied object and replace the specific number
    traverse(updatedData);

    return updatedData;
  }

  // console.log(replaceSpecificNumber(separation, 67));

  return (
    <div>
      <h2>Carte Graphique</h2>
      <div className="maps-page-container">
        <div className="selection-menu-container">
          <SelectionMenu
            elections={elections}
            setMapList={setMapList}
            mapList={mapList}
          />
          <div className="map-browser">
            {mapList[0] !== "blank" &&
              mapList.map((map) => {
                if (typeof map === "string") {
                  return (
                    <span key={map}>
                      {map}
                      <DoDisturbAltIcon
                        className="close-icon"
                        onClick={() => removeMap(map)}
                      />
                    </span>
                  );
                } else {
                  return (
                    <span key={`${map.type} - ${map.election}: ${map.partie}`}>
                      {`${map.type} - ${map.election}: ${map.partie}`}
                      <DoDisturbAltIcon
                        className="close-icon"
                        onClick={() =>
                          removeMap(
                            `${map.type} - ${map.election}: ${map.partie}`
                          )
                        }
                      />
                    </span>
                  );
                }
              })}
          </div>
        </div>
        <div className="map-collector">
          {mapList &&
            mapList.map((map) => (
              <MapComponent
                key={map}
                topojson={TUNISIA_TOPO_JSON}
                separation={separation}
                data={map}
              />
            ))}
        </div>

        {mapList.length < 2 && (
          <div className="commentary-container">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ratione
              dicta quas quam consectetur vel dolor. Officiis ipsam quae saepe
              odit sunt dignissimos quis, explicabo iure illo. Id excepturi
              officia facilis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maps;
