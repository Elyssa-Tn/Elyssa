import { useRef, useState } from "react";
import html2canvas from "html2canvas";
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
  Autocomplete,
  Dropdown,
  MenuButton,
  Menu,
  MenuItem,
} from "@mui/joy";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import styled from "@emotion/styled";
import MapComponent from "./MapComponents/MapComponent";
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
import DownloadButton from "./DownloadButton";
import {
  downloadCSV,
  downloadJPG,
  downloadPNG,
  downloadXLS,
} from "../utils/downloader";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
}));

function MapCard({ ID, bounds, autocompleteOptions, geojson }) {
  const compare = useSelector((state) => state.interface.compareToggle);
  const levels = useSelector((state) => state.interface.levels);
  let level = useSelector((state) => state.interface.level);
  const chartMode = useSelector((state) => state.interface.chartMode[ID]);
  const tableMode = useSelector((state) => state.interface.tableMode[ID]);
  const map = useSelector((state) => state.maps[ID]);
  const elections = useSelector((state) => state.elections.init.elections);
  const currentTarget = useSelector((state) => state.interface.currentTarget);

  if (map.type === "indicator") level = "delegation";

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

  const deckRef = useRef(null);

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

  // const downloadSVG = async () => {
  //   if (mapRef.current) {
  //     const mapImage = await toSvg(mapRef.current);
  //     const link = document.createElement("a");
  //     link.href = mapImage;
  //     link.download = "map.svg";
  //     link.click();
  //   }
  // };

  const downloadIMG = () => {
    deckRef?.current.redraw();
    const image = deckRef?.current?.deck?.getCanvas()?.toDataURL("img/png");
    const a = document.createElement("a");
    a.href = image;
    a.download = "screenshot.png";
    a.click();
  };

  const dataDownloadOptions = [
    { format: ".csv", downloadFunction: downloadCSV, data: { map, level } },
    { format: ".xls", downloadFunction: downloadXLS, data: { map, level } },
  ];

  const imageDownloadOptions = [
    { format: ".svg", downloadFunction: downloadIMG },
    { format: ".png", downloadFunction: downloadIMG },
  ];

  if (Object.keys(geojson).length === levels.length && map) {
    return (
      <>
        {geojson && map && (
          <Card
            id="map-card"
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
                    ) : map.type === "indicator" ? null : (
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
                            <Chip>{map.tp?.inscrits?.toLocaleString()}</Chip>
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
                                ? `${map.parti.voix.toLocaleString()}`
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
                    deckRef={deckRef}
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
                minHeight: !compare ? "35rem" : "null",
                minWidth: compare ? "26rem" : "16rem",
                maxWidth: compare ? "40rem" : "16rem",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                margin: "0",
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
                <DownloadButton
                  compare={compare}
                  icon={<TableChartIcon />}
                  text={"Télécharger les données"}
                  options={dataDownloadOptions}
                />
                <DownloadButton
                  compare={compare}
                  icon={<PanoramaIcon />}
                  text={"Télécharger la carte"}
                  options={imageDownloadOptions}
                />
              </ButtonGroup>
            </Sheet>
          </Card>
        )}
      </>
    );
  }
}

export default MapCard;
