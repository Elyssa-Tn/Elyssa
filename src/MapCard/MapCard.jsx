import { useEffect, useState } from "react";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import styled from "@emotion/styled";
import MapComponent2 from "./MapComponents/MapComponent2";
import ExpandedResults from "./MapComponents/ExpandedResults";
// import useDataFetch from "../Utility/useDataFetch";
// import { SyncLoader } from "react-spinners";
import Legend from "./MapComponents/Legend";
// import ChartElement from "./ChartElement";
// import ExpandedChartResults from "./MapComponents/ExpandedChartResults";
// import geojson from "../assets/Circonscripton2022-vfinal.json";
// import geojson from "../assets/secteurs-2022.json";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

// function MapCard({ map, removeMap, updateMaps }) {
function MapCard({ map }) {
  console.log(map);

  const mapFiles = {
    secteur: () => import("../assets/secteurs-2022.json"),
    commune: () => import("../assets/commune.json"),
    delegation: () => import("../assets/delegation.json"),
    circonscription: (electioncode) => {
      if (electioncode === "tnleg2022")
        return import("../assets/circonscription2022.json");
      if (electioncode === "TNAC2011")
        return import("../assets/circonscription2011-2019.json");
      else {
        return import("../assets/commune.json");
      }
    },
    // electioncode === "tnleg2022"
    //   ? import("../assets/circonscription2022.json")
    //   : import("../assets/circonscription2011-2019.json"),
    // circonscription: () => import("../assets/commune.json"),
    gouvernorat: () => import("../assets/gouvernorat.json"),
  };

  const colors = ["#fff12e", "#ff1900"];

  const nomenclature = {
    secteur: { code: "REF_TN_COD", name: "NAME_FR" },
    commune: { code: "CODEMUN_2", name: "NAME_FR_2" },
    delegation: { code: "CODEDELEGA", name: "NOMDELEGAT" },
    circonscription: { code: "CODE_CIRCO", name: "NAME_FR" },
    // circonscription: { code: "CODEMUN_2", name: "NAME_FR_2" },
    gouvernorat: { code: "code_gouvernorat", name: "nom_gouvernorat" },
  };

  const [expanded, setExpanded] = useState(false);
  const [geojson, setGeojson] = useState(null);
  const [request, setRequest] = useState(null);
  // const [level, setLevel] = useState(
  //   map.decoupage ? map.decoupage : "gouvernorat"
  // );
  const [level, setLevel] = useState(
    map.level ? map.level.code : "gouvernorat"
  );

  useEffect(() => {
    const loadGeojson = async () => {
      if (level) {
        const importFunction = mapFiles[level];
        if (importFunction) {
          const { default: geojson } = await importFunction(
            map.data.code_election
          );
          setGeojson(geojson);
        }
      }
    };
    loadGeojson();
  }, [level]);

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

  const getPartiNames = () => {
    const partiNames = {};
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // const formatFilter = ({ bounds, delegation }) => {
  //   const currentLevel = level;
  //   const levels = Object.keys(nomenclature);
  //   const currentIndex = levels.indexOf(currentLevel);

  //   const newLevel = currentIndex > 0 ? levels[currentIndex - 1] : currentLevel;

  //   const updatedMap = {
  //     ...map,
  //     level: { code: newLevel },
  //     filtre: { decoupage: currentLevel, valeur: delegation },
  //     target: bounds,
  //   };

  //   updateMaps({ index, map: updatedMap });
  // };

  // const { data, loading } = useDataFetch(requestFormatter());

  // if (loading) {
  //   return (
  //     <SyncLoader
  //       style={{
  //         position: "absolute",
  //         bottom: "20%",
  //         left: "50%",
  //         transform: "translate(-50%, -50%)",
  //       }}
  //     />
  //   );
  // }

  // if (data.errors) {
  //   return <span>{data.errors[0].message}</span>;
  // }

  // if (map.chart && data) {
  //   return (
  //     <Card
  //       key={(map, level)}
  //       style={{
  //         margin: "4px",
  //         borderRadius: "16px",
  //         position: "relative",
  //         paddingRight: "44px",
  //       }}
  //     >
  //       <Box
  //         style={{
  //           display: "flex",
  //           flex: "row",
  //           justifyContent: "space-between",
  //         }}
  //       >
  //         <Typography
  //           align="center"
  //           style={{ padding: 8, marginTop: 8, maxWidth: 240 }}
  //         >
  //           {map.data.code_election}
  //         </Typography>
  //         <CardActions
  //           style={{
  //             padding: 0,
  //           }}
  //           disableSpacing
  //         >
  //           <IconButton onClick={() => removeMap(map.key)}>
  //             <HighlightOffIcon />
  //           </IconButton>
  //           <ExpandMore
  //             expand={expanded}
  //             onClick={handleExpandClick}
  //             aria-expanded={expanded}
  //             aria-label="Voir les donnees"
  //           >
  //             <DoubleArrowIcon
  //               style={{
  //                 transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
  //                 // marginLeft: "auto",
  //               }}
  //             />
  //           </ExpandMore>
  //         </CardActions>
  //       </Box>
  //       <CardContent
  //         style={{
  //           display: "flex",
  //           paddingBottom: "8px",
  //         }}
  //       >
  //         <ChartElement data={data.data.variables} />
  //         <Collapse
  //           orientation="horizontal"
  //           in={expanded}
  //           timeout="auto"
  //           unmountOnExit
  //         >
  //           <ExpandedChartResults results={data.data.variables} />
  //         </Collapse>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (geojson && map) {
    const names = getDivisionNames(geojson);

    return (
      <>
        {geojson && map && (
          <Card
            key={(map, level)}
            style={{
              margin: "4px",
              borderRadius: "16px",
              position: "relative",
              paddingRight: "44px",
            }}
          >
            <Box
              style={{
                display: "flex",
                flex: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography style={{ padding: 8, marginTop: 8, maxWidth: 240 }}>
                {map.data.code_election}{" "}
                {map.parti ? `- ${map.parti.denomination_fr}` : null}
                {map.variable ? `- ${map.variable.nom}` : null}
              </Typography>
              <CardActions
                style={{
                  padding: 0,
                }}
                disableSpacing
              >
                {/* <IconButton onClick={() => removeMap(map.key)}>
                  <HighlightOffIcon />
                </IconButton> */}
                <ExpandMore
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="Voir les donnees"
                >
                  <DoubleArrowIcon
                    style={{
                      transform: !expanded ? "rotate(0deg)" : "rotate(180deg)",
                      // marginLeft: "auto",
                    }}
                  />
                </ExpandMore>
              </CardActions>
            </Box>
            <CardContent
              style={{
                display: "flex",
                paddingBottom: "8px",
              }}
            >
              <Legend data={map.data.variables[0].resultat} colors={colors} />
              <MapComponent2
                naming={nomenclature[level]}
                data={map.data.variables[0].resultat}
                geojson={geojson}
                level={level}
                setLevel={setLevel}
                // filter={formatFilter}
                target={map.target}
                colors={colors}
              />
              <Collapse
                orientation="horizontal"
                in={expanded}
                timeout="auto"
                unmountOnExit
              >
                <ExpandedResults
                  results={map.data}
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
}

export default MapCard;
