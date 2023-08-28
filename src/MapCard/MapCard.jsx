import { useEffect, useRef, useState } from "react";
// import {  Card,  IconButton,  CardActions,  CardContent,  Box,  Typography,} from "@mui/material";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  Box,
  Typography,
} from "@mui/joy";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import styled from "@emotion/styled";
import MapComponent2 from "./MapComponents/MapComponent2";
import ExpandedResults from "./MapComponents/ExpandedResults";
// import useDataFetch from "../Utility/useDataFetch";
// import { SyncLoader } from "react-spinners";
import CircularProgress from "@mui/material/CircularProgress";
import Legend2 from "./MapComponents/Legend2";
import Legend from "./MapComponents/Legend";
// import ChartElement from "./ChartElement";
// import ExpandedChartResults from "./MapComponents/ExpandedChartResults";
// import geojson from "../assets/Circonscripton2022-vfinal.json";
// import geojson from "../assets/secteurs-2022.json";

// import * as htmlToImage from "html-to-image";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";
import ExploreIcon from "@mui/icons-material/Explore";
import TableChartIcon from "@mui/icons-material/TableChart";
import { toSvg } from "html-to-image";
import { useDispatch, useSelector } from "react-redux";
import { TabList, TabPanel, Tabs, Tab } from "@mui/joy";
import InfoPanel from "./MapComponents/InfoPanel";
import { deleteMap } from "../reducers/mapReducer";
import { getGeoJSON } from "../services/geojson";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

// function MapCard({ map, removeMap, updateMaps }) {
function MapCard({ id, map, electionInfo }) {
  const [displayMode, setDisplayMode] = useState(1);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  // const mapFiles = {
  //   secteur: () => import("../assets/secteurs-2022.json"),
  //   commune: () => import("../assets/commune.json"),
  //   delegation: () => import("../assets/delegation.json"),
  //   circonscription: (electioncode) => {
  //     if (electioncode === "tnleg2022")
  //       return import("../assets/circonscription2022.json");
  //     if (electioncode === "TNAC2011")
  //       return import("../assets/circonscription2011-2019.json");
  //     else {
  //       return import("../assets/commune.json");
  //     }
  //   },
  //   // electioncode === "tnleg2022"
  //   //   ? import("../assets/circonscription2022.json")
  //   //   : import("../assets/circonscription2011-2019.json"),
  //   // circonscription: () => import("../assets/commune.json"),
  //   gouvernorat: () => import("../assets/gouvernorat.json"),
  // };

  const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
  const colors2 = ["#ffffff", "#a8281e"];
  const colors3 = ["#00ffd5", "#00806b", "#3f4540", "#663d14", "#bf6100"];

  const nomenclature = {
    secteur: { code: "REF_TN_COD", name: "NAME_FR" },
    commune: { code: "CODEMUN_2", name: "NAME_FR_2" },
    // delegation: { code: "CODEDELEGA", name: "NOMDELEGAT" },
    delegation: { code: "circo_id", name: "NOMDELEGAT" },
    circonscription: { code: "CODE_CIRCO", name: "NAME_FR" },
    // circonscription: { code: "CODEMUN_2", name: "NAME_FR_2" },
    gouvernorat: { code: "code_gouvernorat", name: "nom_gouvernorat" },
  };

  const [expanded, setExpanded] = useState(false);
  const [geojson, setGeojson] = useState(null);
  const [request, setRequest] = useState(null);
  const [target, setTarget] = useState(null);
  // const [level, setLevel] = useState(
  //   map.decoupage ? map.decoupage : "gouvernorat"
  // );
  // const [level, setLevel] = useState(
  //   map.data ? map.data.decoupage : "gouvernorats"
  // );
  const [level, setLevel] = useState(map.data.decoupage);

  // const geojson = useSelector((state) => state.elections.init.maps[level]);
  useEffect(() => {
    const fetchAndUseGeoJSON = async () => {
      try {
        const map = await getGeoJSON(level);
        setGeojson(map);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndUseGeoJSON();
  }, [level]);

  if (!geojson) {
    return (
      <CircularProgress
        style={{
          position: "relative",
          bottom: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  // useEffect(() => {
  //   const loadGeojson = async () => {
  //     if (level) {
  //       const importFunction = mapFiles[level];
  //       if (importFunction) {
  //         setGeojson(null);
  //         const { default: geojson } = await importFunction(
  //           map.data.code_election
  //         );
  //         setGeojson(geojson);
  //       }
  //     }
  //   };
  //   loadGeojson();
  // }, [level]);

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

  const removeMap = (id) => {
    dispatch(deleteMap(id));
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
  // <SyncLoader
  //   style={{
  //     position: "absolute",
  //     bottom: "20%",
  //     left: "50%",
  //     transform: "translate(-50%, -50%)",
  //   }}
  // />
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

  const handleDownload = async () => {
    if (mapRef.current) {
      const mapImage = await toSvg(mapRef.current);
      const link = document.createElement("a");
      link.href = mapImage;
      link.download = "map.svg";
      link.click();
    }
  };

  if (geojson && map) {
    const names = getDivisionNames(geojson);

    return (
      <>
        {geojson && map && (
          <Card
            key={(map, level)}
            style={{
              width: "460px",
              margin: "4px",
              borderRadius: "16px",
              position: "relative",
            }}
            ref={mapRef}
          >
            <Box
              style={{
                display: "flex",
                flex: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography style={{ padding: 8, marginTop: 8 }}>
                {electionInfo.election.nom}
                {electionInfo.parti
                  ? ` - ${electionInfo.parti.denomination_fr}`
                  : null}
                {electionInfo.variable
                  ? `- ${electionInfo.variable.nom}`
                  : null}
              </Typography>
              <CardActions
                style={{
                  padding: 0,
                }}
                disableSpacing
              >
                {/* <IconButton onClick={() => dispatch(deleteMap(id))}>
                  <HighlightOffIcon />
                </IconButton> */}
                {/* <ExpandMore
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
                </ExpandMore> */}
                {/* <button onClick={handleDownload}>
                  <DownloadIcon />
                </button> */}
              </CardActions>
            </Box>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: "8px",
              }}
            >
              <Tabs defaultValue={0}>
                <TabList>
                  <Tab>
                    <InfoIcon />
                  </Tab>
                  <Tab>
                    <ExploreIcon />
                  </Tab>
                  <Tab>
                    <TableChartIcon />
                  </Tab>
                </TabList>
                <TabPanel>
                  <InfoPanel electionInfo={electionInfo.election} />
                </TabPanel>
                <TabPanel value={1}>
                  {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
                  {/* <button
                      onClick={() => setDisplayMode(1)}
                      style={{
                        position: "absolute",
                        top: "120px",
                        left: "0px",
                        borderRadius: "5px",
                      }}
                    >
                      1
                    </button>
                    <button
                      onClick={() => setDisplayMode(2)}
                      style={{
                        position: "absolute",
                        top: "180px",
                        left: "0px",
                        borderRadius: "5px",
                      }}
                    >
                      2
                    </button> */}
                  <MapComponent2
                    naming={nomenclature[level]}
                    data={map.data.variables[0].resultat}
                    geojson={geojson}
                    level={level}
                    setLevel={setLevel}
                    // filter={formatFilter}
                    target={target}
                    setTarget={setTarget}
                    colors={colors}
                    colors2={colors2}
                    displayMode={displayMode}
                  />
                  {displayMode === 1 && (
                    <Legend2
                      data={map.data.variables[0].resultat}
                      colors={colors}
                    />
                  )}
                  {displayMode === 2 && (
                    <Legend
                      data={map.data.variables[0].resultat}
                      colors={colors2}
                    />
                  )}
                  {/* </div> */}
                </TabPanel>
                <TabPanel value={2}>
                  <ExpandedResults
                    results={map.data}
                    level={level}
                    names={names}
                  />
                </TabPanel>
              </Tabs>
              {/* <MapComponent2
                naming={nomenclature[level]}
                data={map.data.variables[0].resultat}
                geojson={geojson}
                level={level}
                setLevel={setLevel}
                // filter={formatFilter}
                target={map.target}
                colors={colors}
              /> */}
            </CardContent>
          </Card>
        )}
      </>
    );
  }
}

export default MapCard;
