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

function MapCard({ id, map, toggleLayer, classNumber }) {
  const [displayMode, setDisplayMode] = useState(1);
  const [hoveredGeo, setHoveredGeo] = useState(null);

  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
  const colors2 = ["#ffffff", "#a8281e"];
  const colors3 = ["#00ffd5", "#00806b", "#3f4540", "#663d14", "#bf6100"];

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
  const [geojson, setGeojson] = useState({});
  const [request, setRequest] = useState(null);
  const [target, setTarget] = useState(null);

  const [level, setLevel] = useState("gouvernorat");

  useEffect(() => {
    const fetchAndUseGeoJSON = async (level) => {
      try {
        const map = await getGeoJSON(level);
        return { [level]: map };
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };

    const levelsToFetch = ["gouvernorat", "delegation"];

    Promise.all(levelsToFetch.map(fetchAndUseGeoJSON))
      .then((results) => {
        const formattedResults = {};
        results.forEach((entry) => {
          const key = Object.keys(entry)[0];
          formattedResults[key] = entry[key];
        });
        setGeojson(formattedResults);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

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

  const normalizeData = (data) => {
    const result = {};

    data.forEach((item) => {
      const { code_variable, resultat } = item;
      result[code_variable] = {};
      for (const key in resultat) {
        result[code_variable][key] = resultat[key];
      }
    });

    return result;
  };

  const data = normalizeData(map.data.variables);

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

  if (Object.keys(geojson).length === 2 && map) {
    // const names = getDivisionNames(geojson);

    return (
      <>
        {geojson && map && (
          <Card
            // key={(map, level)}
            key={map}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "66rem",
              margin: "0.25rem 8rem",
              borderRadius: "16px",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
            ref={mapRef}
          >
            <CardContent
              style={{
                paddingBottom: "8px",
              }}
            >
              {displayMode === 1 && (
                <Legend2
                  data={data["prc"]}
                  colors={colors}
                  hover={hoveredGeo}
                />
              )}
              {displayMode === 2 && (
                <Legend
                  data={map.data.variables[0].resultat}
                  colors={colors2}
                />
              )}
              <MapComponent2
                naming={nomenclature[level]}
                data={data}
                geojson={geojson}
                level={level}
                setLevel={setLevel}
                target={target}
                setTarget={setTarget}
                // colors={colors}
                colors={Heatmap4}
                colors2={colors2}
                displayMode={displayMode}
                toggleLayer={toggleLayer}
                classNumber={classNumber}
                hover={hoveredGeo}
                setHover={setHoveredGeo}
              />
            </CardContent>
          </Card>
        )}
      </>
    );
  }
}

export default MapCard;
