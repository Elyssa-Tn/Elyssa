import { useRef, useState } from "react";
import {
  Card,
  IconButton,
  Box,
  Typography,
  Divider,
  Chip,
  Sheet,
  Button,
  ButtonGroup,
  Stack,
  FormControl,
  FormLabel,
  Autocomplete,
  FormHelperText,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
} from "@mui/joy";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import styled from "@emotion/styled";
import * as L from "leaflet";
import MapComponent from "./MapComponents/MapComponent";
import ExpandedResults from "./MapComponents/ExpandedResults";
import Legend2 from "./MapComponents/Legend2";
import Legend from "./MapComponents/Legend";

// import * as htmlToImage from "html-to-image";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/joy/CircularProgress";

import InfoIcon from "@mui/icons-material/Info";
import PanoramaIcon from "@mui/icons-material/Panorama";
import TableChartIcon from "@mui/icons-material/TableChart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExploreIcon from "@mui/icons-material/Explore";
import { toSvg } from "html-to-image";
import { useDispatch, useSelector } from "react-redux";
import { deleteMap, fetchEvolutionData } from "../reducers/mapReducer";
import {
  resetViewport,
  setCurrentTarget,
  setLevel,
  setModalCompareFlag,
  setModalOpen,
  toggleCompare,
} from "../reducers/interfaceReducer";
import ChartComponent from "./MapComponents/ChartComponent";
import { ArrowDropDown } from "@mui/icons-material";
import TableComponent from "./MapComponents/TableComponent";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

function MapCard({ ID, bounds, autocompleteOptions, geojson }) {
  const compare = useSelector((state) => state.interface.compareToggle);
  const levels = useSelector((state) => state.interface.levels);
  const level = useSelector((state) => state.interface.level);
  const chartMode = useSelector((state) => state.interface.chartMode[ID]);
  const tableMode = useSelector((state) => state.interface.tableMode[ID]);
  const map = useSelector((state) => state.maps[ID]);
  const elections = useSelector((state) => state.elections.init.elections);
  const currentTarget = useSelector((state) => state.interface.currentTarget);

  const dispatch = useDispatch();

  const [displayMode, setDisplayMode] = useState(1);

  const mapRef = useRef(null);

  const colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
  const colors2 = ["#ffffff", "#a8281e"];
  const colors3 = ["#00ffd5", "#00806b", "#3f4540", "#663d14", "#bf6100"];

  const divergingColors = [
    "rgb(215,25,28)",
    "rgb(253,174,97)",
    "rgb(255,255,191)",
    "rgb(166,217,106)",
    "rgb(26,150,65)",
  ];

  const convertedDivergingColors = [
    [215, 25, 28, 255],
    [253, 174, 97, 255],
    [255, 255, 191, 255],
    [166, 217, 106, 255],
    [26, 150, 65, 255],
  ];

  const Heatmap4 = [
    // "#ffffff",
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

  const Heatmap4Converted = [
    // [255, 255, 255, 255],
    [255, 227, 170, 255],
    [255, 198, 85, 255],
    [255, 170, 0, 255],
    [255, 113, 0, 255],
    [255, 57, 0, 255],
    [255, 0, 0, 255],
    [213, 6, 33, 255],
    [170, 11, 67, 255],
    [128, 17, 100, 255],
    [85, 23, 133, 255],
    [43, 28, 167, 255],
    [0, 34, 200, 255],
  ];

  const [expanded, setExpanded] = useState(false);
  // const [geojson, setGeojson] = useState({});
  const [boundaries, setBoundaries] = useState({});
  const [request, setRequest] = useState(null);
  const [autocompleteValue, setAutocompleteValue] = useState(null);

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

  if (!geojson || !map || !bounds) {
    return (
      <CircularProgress
        style={{
          position: "relative",
          // bottom: "20%",
          // left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }

  const handleDownload = async () => {
    if (mapRef.current) {
      const mapImage = await toSvg(mapRef.current);
      const link = document.createElement("a");
      link.href = mapImage;
      link.download = "map.svg";
      link.click();
    }
  };

  //TODO: Remove this part eventually when the server will have more data for better handling

  const findElectionByCode = (electionCode) => {
    const foundElection = elections.find(
      (election) => election.code_election === electionCode
    );
    return foundElection;
  };

  const Election_1 = findElectionByCode("TNAC2011");
  const Election_2 = findElectionByCode("tnmun2018");

  const selectElectionForEvolution = (election) => {
    const currentElectionCode = election.code_election;

    const otherElectionCode =
      currentElectionCode === Election_1.code_election
        ? Election_2.code_election
        : Election_1.code_election;
    return findElectionByCode(otherElectionCode);
  };

  //END OF TEMPORARY CODE

  const handleEvolutionDisplay = () => {
    const targetElection = selectElectionForEvolution(map.election);
    const request = { election: targetElection, parti: map.parti };

    dispatch(fetchEvolutionData(request));
  };

  const handleTargetSelection = (target) => {
    setAutocompleteValue(target);
    if (target) {
      // dispatch(setLevel(levels[1]));
      dispatch(setLevel("delegation"));
      dispatch(
        setCurrentTarget({
          targetCode: target.key,
          targetName: target.label,
          targetLevel: target.level,
        })
      );
    }
    if (!target) {
      dispatch(resetViewport());
      dispatch(setCurrentTarget(null));
      dispatch(setLevel(levels[0]));
    }
  };

  const capitalize = (word) => {
    return word[0].toUpperCase() + word.slice(1);
  };

  const handleLevelDropdown = (selectedLevel) => {
    dispatch(setLevel(selectedLevel));
  };
  console.log(map);
  if (Object.keys(geojson).length === levels.length && map) {
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
              {chartMode ? (
                <ChartComponent ID={ID} data={map.resultat} bounds={bounds} />
              ) : tableMode ? (
                <TableComponent ID={ID} />
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {(map.type === "simple" ||
                      map.type === "indicator" ||
                      map.type == "TP") && (
                      <Legend2 ID={ID} colors={Heatmap4} />
                    )}
                    {(map.type === "evolution" ||
                      map.type === "comparaison") && (
                      <Legend ID={ID} colors={divergingColors} />
                    )}
                    {map.type === "comparaison" ? (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>
                            {map.parti[0].code_parti} -{" "}
                            {map.election[0].nom.slice(-4)}:
                          </Typography>
                          <Chip>{map.parti[0].prc}%</Chip>
                        </Box>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>
                            {map.parti[1].code_parti} -{" "}
                            {map.election[1].nom.slice(-4)}:
                          </Typography>
                          <Chip>{map.parti[1].prc}%</Chip>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography level="body-sm">
                            {map.type === "evolution"
                              ? "Evolution Nationale: "
                              : "Moyenne Nationale: "}
                          </Typography>
                          <Chip>
                            {map.type === "simple"
                              ? `${map.parti.prc}%`
                              : map.type === "TP"
                              ? `${map.tp.tp}%`
                              : `${(
                                  map.resultat["gouvernorat"]["prc"]["Total"][
                                    "newValue"
                                  ] -
                                  map.resultat["gouvernorat"]["prc"]["Total"][
                                    "oldValue"
                                  ]
                                ).toFixed(1)}%`}
                          </Chip>
                        </Box>
                        <Divider />
                        {map.type === "TP" ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignContent: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography level="body-sm">Votes:</Typography>
                            <Chip>{map.tp.votes.toLocaleString()}</Chip>
                            <Typography level="body-sm">Inscrits:</Typography>
                            <Chip>{map.tp.inscrits.toLocaleString()}</Chip>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              alignContent: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography>
                              {map.type === "simple"
                                ? "Total des voix: "
                                : "Nombre de voix: "}
                            </Typography>
                            <Chip>
                              {map.type === "simple"
                                ? `${map.parti.voix}`
                                : `${
                                    map.resultat["gouvernorat"]["voix"][
                                      "Total"
                                    ]["newValue"] -
                                    map.resultat["gouvernorat"]["voix"][
                                      "Total"
                                    ]["oldValue"]
                                  }`}
                            </Chip>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Divider />
                  <MapComponent
                    ID={ID}
                    data={map.resultat}
                    type={map.type}
                    geojson={geojson}
                    // colors={colors}
                    colors={Heatmap4Converted}
                    divergingColors={convertedDivergingColors}
                    displayMode={displayMode}
                    bounds={bounds}
                  />
                </>
              )}
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
              <Stack spacing={1}>
                <Typography level="h4" sx={{ pb: 1 }}>
                  Choisir un niveau:
                </Typography>
                <Dropdown>
                  <MenuButton endDecorator={<ArrowDropDown />}>
                    {capitalize(level)}
                  </MenuButton>
                  <Menu>
                    {levels.map((levelEntry) => (
                      <MenuItem
                        sx={{ justifyContent: "space-between" }}
                        key={levelEntry}
                        selected={level === levelEntry}
                        onClick={() => handleLevelDropdown(levelEntry)}
                      >
                        {capitalize(levelEntry)}
                      </MenuItem>
                    ))}
                  </Menu>
                </Dropdown>
                <Typography level="h4" sx={{ pb: 1 }}>
                  Sélectionnez un espace d'étude:
                </Typography>
                <FormControl>
                  {/* <FormLabel>Label</FormLabel> */}
                  <Autocomplete
                    placeholder="ex: Ariana Ville"
                    options={autocompleteOptions}
                    groupBy={(option) => option.level}
                    getOptionKey={(option) => option.code}
                    onChange={(event, newValue) =>
                      handleTargetSelection(newValue)
                    }
                  />
                  {/* <FormHelperText>
                    A description for the combo box.
                  </FormHelperText> */}
                </FormControl>
              </Stack>
              {/* <Divider orientation={compare ? "vertical" : "horizontal"} />
              {!compare && (
                <Box>
                  {map.type === "evolution" ? (
                    <Box>
                      <Typography>Afficher la carte de:</Typography>
                      <ButtonGroup>
                        <Button>{map.election[0].fin}</Button>
                        <Button>{map.election[1].fin}</Button>
                      </ButtonGroup>
                    </Box>
                  ) : (
                    <Box>
                      <Typography>
                        Afficher l'evolution de cet indicateur?
                      </Typography>
                      <Button onClick={handleEvolutionDisplay}>Afficher</Button>
                    </Box>
                  )}
                </Box>
              )} */}
              <Divider />
              {currentTarget && (
                <Typography level="title-lg">
                  {capitalize(currentTarget.targetLevel)} de{" "}
                  {currentTarget.targetName}
                </Typography>
              )}
              {!compare ? (
                <Stack>
                  <Typography>Comparez avec un autre indicateur:</Typography>
                  <Button
                    onClick={() => {
                      dispatch(setModalCompareFlag(true));
                      dispatch(setModalOpen(true));
                    }}
                    endDecorator={<AddCircleOutlineIcon />}
                    disabled={map.type === "evolution"}
                  >
                    <Typography>Sur la même carte</Typography>
                  </Button>
                  <Typography>Ou</Typography>
                  <Button
                    onClick={() => dispatch(setModalOpen(true))}
                    endDecorator={<AddCircleOutlineIcon />}
                  >
                    <Typography>Sur une deuxième carte</Typography>
                  </Button>
                </Stack>
              ) : null}

              <Divider orientation={compare ? "vertical" : "horizontal"} />
              <ButtonGroup orientation="vertical">
                {/* <Button
                  sx={{
                    justifyContent: "space-between",
                  }}
                  size="sm"
                  endDecorator={compare ? null : <InfoIcon />}
                >
                  {compare ? (
                    <InfoIcon />
                  ) : (
                    <Typography>Méthodologie</Typography>
                  )}
                </Button> */}
                <Button
                  sx={{
                    justifyContent: "space-between",
                  }}
                  size="sm"
                  endDecorator={compare ? null : <TableChartIcon />}
                >
                  {compare ? (
                    <TableChartIcon />
                  ) : (
                    <Typography>Télécharger les données</Typography>
                  )}
                </Button>
                <Button
                  sx={{
                    justifyContent: "space-between",
                  }}
                  size="sm"
                  endDecorator={compare ? null : <PanoramaIcon />}
                >
                  {compare ? (
                    <PanoramaIcon />
                  ) : (
                    <Typography>Télécharger la carte</Typography>
                  )}
                </Button>
              </ButtonGroup>
            </Sheet>
          </Card>
        )}
      </>
    );
  }
}

export default MapCard;
