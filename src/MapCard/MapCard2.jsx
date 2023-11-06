import { useEffect, useRef, useState } from "react";
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  Box,
  Typography,
  Switch,
  Divider,
  Chip,
  Sheet,
  Input,
  Button,
} from "@mui/joy";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import styled from "@emotion/styled";
import * as L from "leaflet";
import MapComponent2 from "./MapComponents/MapComponent2";
// import MapComponent2 from "./MapComponents/MapComponent";
import ExpandedResults from "./MapComponents/ExpandedResults";
import Legend2 from "./MapComponents/Legend2";
import Legend from "./MapComponents/Legend";

// import * as htmlToImage from "html-to-image";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/joy/CircularProgress";

import InfoIcon from "@mui/icons-material/Info";
import PanoramaIcon from "@mui/icons-material/Panorama";
import TableChartIcon from "@mui/icons-material/TableChart";
import ExploreIcon from "@mui/icons-material/Explore";
import { toSvg } from "html-to-image";
import { useDispatch, useSelector } from "react-redux";
import { TabList, TabPanel, Tabs, Tab } from "@mui/joy";
import InfoPanel from "./MapComponents/InfoPanel";
import { deleteMap } from "../reducers/mapReducer";
import { getGeoJSON } from "../services/geojson";
import { toggleCompare } from "../reducers/interfaceReducer";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

function MapCard({ ID, toggleLayer, bounds, geojson }) {
  const compare = useSelector((state) => state.interface.compareToggle);
  const maps = useSelector((state) => state.maps);

  const dispatch = useDispatch();

  const [displayMode, setDisplayMode] = useState(1);

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

  const [expanded, setExpanded] = useState(false);
  // const [geojson, setGeojson] = useState({});
  const [boundaries, setBoundaries] = useState({});
  const [request, setRequest] = useState(null);

  const handleCompareToggle = () => {
    dispatch(toggleCompare());
  };

  // useEffect(() => {
  //   const fetchAndUseGeoJSON = async (level) => {
  //     try {
  //       const map = await getGeoJSON(level);
  //       return { [level]: map };
  //     } catch (error) {
  //       console.error("Error:", error);
  //       throw error;
  //     }
  //   };

  //   const levelsToFetch = ["gouvernorat", "delegation"];

  //   Promise.all(levelsToFetch.map(fetchAndUseGeoJSON))
  //     .then((results) => {
  //       const formattedResults = {};
  //       results.forEach((entry) => {
  //         const key = Object.keys(entry)[0];
  //         formattedResults[key] = entry[key];
  //       });
  //       setGeojson(formattedResults);
  //     })
  //     .catch((error) => {
  //       console.error("An error occurred:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   const boundsObject = {};

  //   for (const mapName in geojson) {
  //     if (geojson.hasOwnProperty(mapName)) {
  //       boundsObject[mapName] = {};

  //       const geoJSON = geojson[mapName];

  //       geoJSON.features.forEach((feature) => {
  //         const code = feature.properties[nomenclature[mapName].code];

  //         const geometryType = feature.geometry.type;
  //         let bounds;

  //         const polygons =
  //           geometryType === "Polygon"
  //             ? [feature.geometry.coordinates]
  //             : feature.geometry.coordinates;

  //         const latLngs = [];
  //         for (const polygon of polygons) {
  //           for (const ring of polygon) {
  //             latLngs.push(
  //               ...ring.map((coord) => L.latLng(coord[1], coord[0]))
  //             );
  //           }
  //         }

  //         // Calculate the bounds using latLngs array.
  //         bounds = L.latLngBounds(latLngs);

  //         // Store the bounds in the object.
  //         boundsObject[mapName][code] = bounds;
  //       });
  //     }
  //   }
  // }, [geojson]);

  if (!geojson || !maps || !bounds) {
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

  const map = maps[ID];

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
    return (
      <>
        {geojson && map && (
          <Card
            variant="soft"
            // key={map}
            key={ID}
            style={{
              display: "flex",
              flexDirection: compare ? "column" : "row",
              position: "relative",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderRadius: 0,
              borderTop: "none",
              borderBottom: "none",
            }}
            ref={mapRef}
          >
            <Box
              style={{
                paddingBottom: "0.5rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* {displayMode === 1 && <Legend2 ID={ID} colors={colors} />} */}
                {displayMode === 1 && <Legend2 ID={ID} colors={Heatmap4} />}
                {displayMode === 2 && <Legend ID={ID} colors={colors2} />}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>Moyenne Nationale: </Typography>{" "}
                    <Chip>
                      {map.normalizedData["gouvernorat"]["prc"]["Total"]}%
                    </Chip>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>Total des voix: </Typography>{" "}
                    <Chip>
                      {map.normalizedData["gouvernorat"]["voix"]["Total"]}
                    </Chip>
                  </Box>
                </Box>
              </Box>
              <Divider />
              <MapComponent2
                ID={ID}
                data={map.normalizedData}
                geojson={geojson}
                // colors={colors}
                colors={Heatmap4}
                colors2={colors2}
                displayMode={displayMode}
                toggleLayer={toggleLayer}
                bounds={bounds}
              />
            </Box>
            <Divider orientation="vertical" />
            <Sheet
              sx={{
                display: "flex",
                flexDirection: compare ? "row" : "column",
                justifyContent: "space-between",
                alignContent: "center",
                height: "100%",
                maxWidth: compare ? "30rem" : "16rem",
              }}
            >
              <Box>
                <Typography>Rechercher un gouvernorat:</Typography>
                <Input placeholder="ex: Ariana" color="primary" />
              </Box>
              <Divider />
              <Box>
                <Typography>Comparez avec un autre indicateur:</Typography>
                <Button onClick={handleCompareToggle} endDecorator={"+"}>
                  {compare ? "Annulez La comparaison" : "Comparez"}
                </Button>
              </Box>
              <Divider />
              <Box>
                <Button>
                  {compare ? (
                    <InfoIcon />
                  ) : (
                    <>
                      Méthodologie <InfoIcon />
                    </>
                  )}
                </Button>
                <Button>
                  {compare ? (
                    <TableChartIcon />
                  ) : (
                    <>
                      Télécharger les données <TableChartIcon />
                    </>
                  )}
                </Button>
                <Button>
                  {compare ? (
                    <PanoramaIcon />
                  ) : (
                    <>
                      Télécharger la carte <PanoramaIcon />
                    </>
                  )}
                </Button>
              </Box>
            </Sheet>
          </Card>
        )}
      </>
    );
  }
}

export default MapCard;
