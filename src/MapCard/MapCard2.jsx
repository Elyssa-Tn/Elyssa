import { useEffect, useRef, useState } from "react";
// import {  Card,  IconButton,  CardActions,  CardContent,  Box,  Typography,} from "@mui/material";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  Box,
  Typography,
  Switch,
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

function MapCard({
  id,
  map,
  electionInfo,
  toggleLayer,
  fillValue,
  classNumber,
}) {
  const [displayMode, setDisplayMode] = useState(1);

  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
  const colors2 = ["#ffffff", "#a8281e"];
  const colors3 = ["#00ffd5", "#00806b", "#3f4540", "#663d14", "#bf6100"];
  // Esri color ramps - Heatmap 4
  // #0022c8,#2b1ca7,#551785,#801164,#aa0b43,#d50621,#ff0000,#ff3900,#ff7100,#ffaa00,#ffc655,#ffe3aa,#ffffff
  const Heatmap4 = [
    "#ffffff",
    "#ffe3aa",
    "#ffc655",
    "#ffaa00",
    "#ff7100",
    "#ff3900",
    "#ff0000",
    "#d50621",
    "#aa0b43",
    "#801164",
    "#551785",
    "#2b1ca7",
    "#0022c8",
  ];

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

  const [level, setLevel] = useState(map.data.decoupage);

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
    console.log("loading");
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
    // const names = getDivisionNames(geojson);

    return (
      <>
        {geojson && map && (
          <Card
            key={(map, level)}
            style={{
              width: "auto",
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
            </Box>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "column",
                paddingBottom: "8px",
              }}
            >
              <MapComponent2
                naming={nomenclature[level]}
                data={map.data.variables[0].resultat}
                geojson={geojson}
                level={level}
                setLevel={setLevel}
                // filter={formatFilter}
                target={target}
                setTarget={setTarget}
                // colors={colors}
                colors={Heatmap4}
                colors2={colors2}
                displayMode={displayMode}
                toggleLayer={toggleLayer}
                fillValue={fillValue}
                classNumber={classNumber}
              />
              {/* {displayMode === 1 && (
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
              )} */}
            </CardContent>
          </Card>
        )}
      </>
    );
  }
}

export default MapCard;
