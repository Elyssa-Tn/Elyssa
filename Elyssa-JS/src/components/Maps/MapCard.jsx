import { useEffect, useState } from "react";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  Collapse,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";
import MapComponent2 from "./MapComponent/MapComponent2";
import ExpandedResults from "./MapComponent/ExpandedResults";
import useDataFetch from "../Utility/useDataFetch";
import { SyncLoader } from "react-spinners";
// import geojson from "../../assets/Circonscripton2022-vfinal.json";
// import geojson from "../../assets/secteurs-2022.json";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

function MapCard({ map }) {
  console.log(map);
  const mapFiles = {
    secteur: () => import("../../assets/secteurs-2022.json"),
    commune: () => import("../../assets/commune.json"),
    delegation: () => import("../../assets/delegation.json"),
    // circonscription: (electioncode) =>
    //   electioncode === "tnleg2022"
    //     ? import("../../assets/circonscription2022.json")
    //     : import("../../assets/circonscription2011-2019.json"),
    circonscription: () => import("../../assets/circonscription2022.json"),
    gouvernorat: () => import("../../assets/gouvernorat.json"),
  };

  const nomenclature = {
    secteur: { code: "REF_TN_COD", name: "NAME_FR" },
    commune: { code: "CODEMUN_2", name: "NAME_FR_2" },
    delegation: { code: "CODEDELEGA", name: "NOMDELEGAT" },
    circonscription: { code: "CODE_CIRCO", name: "NAME_FR" },
    gouvernorat: { code: "code_gouvernorat", name: "nom_gouvernorat" },
  };

  const [expanded, setExpanded] = useState(false);
  const [geojson, setGeojson] = useState(null);
  // const [level, setLevel] = useState(
  //   map.decoupage ? map.decoupage : "gouvernorat"
  // );
  const [level, setLevel] = useState("gouvernorat");

  useEffect(() => {
    const loadGeojson = async () => {
      if (level) {
        const importFunction = mapFiles[level];
        if (importFunction) {
          const { default: geojson } = await importFunction(
            map.election.code_election
          );
          setGeojson(geojson);
        }
      }
    };

    loadGeojson();
  }, [level]);

  const requestFormatter = () => {
    let req = {
      req: {
        type: "data",
        code_election: map.election.code_election,
        decoupage: level,
        ...(map.variable
          ? { variables: [{ code_variable: map.variable.code_variable }] }
          : null),
        ...(map.parti
          ? {
              variables: [
                { code_variable: "prc", code_parti: map.parti.code_parti },
                { code_variable: "voix", code_parti: map.parti.code_parti },
              ],
            }
          : null),
        ...(!map.parti && !map.variable
          ? {
              variables: [
                { code_variable: "prc", code_parti: "*" },
                { code_variable: "voix", code_parti: "*" },
              ],
            }
          : null),
        ...(map.circonscription
          ? {
              filtre: {
                decoupage: "circonscription",
                valeur: map.circonscription.code_circonscription,
              },
              variables: [
                { code_variable: "prc", code_parti: "*" },
                { code_variable: "voix", code_parti: "*" },
              ],
            }
          : null),
      },
    };

    return req;
  };

  const getDivisionNames = (geojson) => {
    const divisionsMap = {};

    for (var i = 0; i < geojson.features.length; i++) {
      const feature = geojson.features[i];
      const name = feature.properties[nomenclature[level].name];
      const code = feature.properties[nomenclature[level].code];

      divisionsMap[code] = name;
    }

    return divisionsMap;
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { data, loading } = useDataFetch(requestFormatter());

  console.log(data);

  if (loading) {
    return (
      <SyncLoader
        style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }
  const names = getDivisionNames(geojson);
  return (
    <>
      {geojson && data && (
        <Card key={(map, level)}>
          <CardActions style={{ padding: 0 }} disableSpacing>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="Voir les donnees"
            >
              Voir les donnees
            </ExpandMore>
          </CardActions>
          <CardContent style={{ display: "flex" }}>
            <MapComponent2
              naming={nomenclature[level]}
              data={data.data.variables[0].resultat}
              geojson={geojson}
              level={level}
              setLevel={setLevel}
            />
            <Collapse
              orientation="horizontal"
              in={expanded}
              timeout="auto"
              unmountOnExit
            >
              <ExpandedResults
                results={data.data}
                level={level}
                names={names}
              />
            </Collapse>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default MapCard;
