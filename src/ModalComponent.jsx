import { Home, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Link,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListSubheader,
  ModalDialog,
  Sheet,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchElectionData } from "./reducers/electionReducer";
import {
  fetchCompareMap,
  fetchIndicatorMap,
  fetchMapData,
  fetchTpMap,
} from "./reducers/mapReducer";
import {
  setModalCompareFlag,
  setModalOpen,
  setReady,
} from "./reducers/interfaceReducer";

const ModalComponent = React.forwardRef(function ModalComponent() {
  const [selectedElection, setSelectedElection] = useState(null);
  const [hoveredElection, setHoveredElection] = useState(null);
  const [hoveredParti, setHoveredParti] = useState(null);

  const init = useSelector((state) => state.elections.init);
  const loading = useSelector((state) => state.elections.loading);
  const data = useSelector((state) => state.elections.data);
  const modalCompareFlag = useSelector(
    (state) => state.interface.modalCompareFlag
  );

  const dispatch = useDispatch();

  const electionSelection = (election) => {
    if (!data[election.code_election])
      dispatch(fetchElectionData(election.code_election));
    setSelectedElection(election);
  };

  const partiSelection = (parti) => {
    const request = { election: selectedElection, parti };
    dispatch(setReady(false));
    dispatch(setModalOpen(false));

    if (modalCompareFlag) {
      dispatch(setModalCompareFlag(false));
      dispatch(fetchCompareMap(request));
    } else {
      dispatch(fetchMapData(request));
    }
  };

  const indicatorSelection = (indicator) => {
    const { code_indicateur, nom_indicateur } = indicator;
    const year = Object.keys(indicator.ans)[0];
    const decoupage = indicator.ans[year].decoupages[0];

    const request = {
      indicateurs: code_indicateur,
      nom_indicateur,
      ans: year,
      decoupage,
    };

    dispatch(setModalOpen(false));
    dispatch(fetchIndicatorMap(request));
  };

  const tpSelection = () => {
    const request = {
      election: selectedElection,
    };

    dispatch(setModalOpen(false));
    dispatch(fetchTpMap(request));
  };

  return (
    <ModalDialog>
      <Tabs
        defaultValue={0}
        sx={{
          width: "48rem",
        }}
      >
        <TabList>
          <Tab key="Données électorales">Données électorales</Tab>
          <Tab key="Indicateurs socio-économiques">
            Indicateurs socio-économiques
          </Tab>
        </TabList>
        <TabPanel value={0}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Link
              variant="plain"
              size="sm"
              onClick={() => setSelectedElection(null)}
            >
              <Home />
            </Link>
            {selectedElection && (
              <Box>
                <KeyboardArrowRight />
                <Link variant="plain">{selectedElection.nom}</Link>
              </Box>
            )}
          </Box>
          <Divider />
          {!selectedElection && (
            <Sheet
              sx={{
                display: "flex",
                flexDirection: "row",
                height: "20rem",
                overflow: "auto",
              }}
            >
              <List
                sx={{
                  width: "24rem",
                  maxWidth: "24rem",
                }}
              >
                {init.elections.map((election) => (
                  <Sheet key={election.code}>
                    <ListItemButton
                      variant="plain"
                      onClick={() => electionSelection(election)}
                      onMouseOver={() => setHoveredElection(election)}
                    >
                      <ListItemContent>{election.nom}</ListItemContent>
                      <KeyboardArrowRight />
                    </ListItemButton>
                    <ListDivider />
                  </Sheet>
                ))}
              </List>
              <Divider orientation="vertical" />
              {hoveredElection && (
                <Card
                  variant="plain"
                  sx={{ width: "24rem", maxWidth: "24rem" }}
                >
                  <Typography level="h3">{hoveredElection.nom}</Typography>
                  <Divider />
                  <Typography level="body-md">
                    Nombre de tours: {hoveredElection.nombre_tours}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography level="body-md">Date debut:</Typography>
                    <Typography level="body-sm">
                      {hoveredElection.debut}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Typography>Date fin:</Typography>
                    <Typography level="body-sm">
                      {hoveredElection.fin}
                    </Typography>
                  </Box>

                  <Divider />
                  <Typography>
                    Mode de scrutin: {hoveredElection.mode_scrutin}
                  </Typography>
                  <Typography>
                    Type de scrutin: {hoveredElection.uninominal_liste}
                  </Typography>
                </Card>
              )}
            </Sheet>
          )}
          {selectedElection && (
            <Sheet>
              {loading ? (
                <CircularProgress />
              ) : (
                <Sheet
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "20rem",
                    overflow: "auto",
                  }}
                >
                  <List
                    sx={{
                      width: "24rem",
                      maxWidth: "24rem",
                      "--List-nestedInsetStart": "1rem",
                    }}
                  >
                    <ListItem nested>
                      <ListSubheader>Resultats</ListSubheader>
                      <List>
                        <ListItemButton variant="plain" onClick={tpSelection}>
                          <ListItemContent>
                            Taux de participations
                          </ListItemContent>
                          <KeyboardArrowRight />
                        </ListItemButton>
                        <ListDivider />
                        <ListItemButton>
                          <ListItemContent>Partis gagnants</ListItemContent>
                          <KeyboardArrowRight />
                        </ListItemButton>
                        <ListDivider />
                      </List>
                    </ListItem>
                    <ListItem nested>
                      <ListSubheader>Partis</ListSubheader>
                      <List>
                        {data[selectedElection.code_election].partis.map(
                          (parti) => (
                            <Box key={parti.code_parti}>
                              <ListItemButton
                                variant="plain"
                                onClick={() => partiSelection(parti)}
                                onMouseOver={() => setHoveredParti(parti)}
                              >
                                <ListItemContent>
                                  {parti.denomination_fr}
                                </ListItemContent>
                                <Chip>{parti.score}%</Chip>
                                <KeyboardArrowRight />
                              </ListItemButton>
                              <ListDivider />
                            </Box>
                          )
                        )}
                      </List>
                    </ListItem>
                  </List>
                  <Divider orientation="vertical" />
                  {hoveredParti && (
                    <Card
                      variant="plain"
                      sx={{ width: "24rem", maxWidth: "24rem" }}
                    >
                      <Typography level="h3">
                        {hoveredParti.denomination_fr}
                      </Typography>
                      <Divider />
                    </Card>
                  )}
                </Sheet>
              )}
            </Sheet>
          )}
        </TabPanel>
        <TabPanel value={1}>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Link
              variant="plain"
              size="sm"
              onClick={() => setSelectedElection(null)}
            >
              <Home />
            </Link>
          </Box>
          <Divider />
          <Sheet
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "20rem",
              overflow: "auto",
            }}
          >
            <List
              sx={{
                width: "24rem",
                maxWidth: "24rem",
              }}
            >
              {init.indicateurs.map((indicateur) => (
                <Sheet key={indicateur.code_indicateur}>
                  <ListItemButton
                    variant="plain"
                    onClick={() => indicatorSelection(indicateur)}
                    onMouseOver={() => setHoveredElection(indicateur)}
                  >
                    <ListItemContent>
                      {indicateur.nom_indicateur}
                    </ListItemContent>
                    <KeyboardArrowRight />
                  </ListItemButton>
                  <ListDivider />
                </Sheet>
              ))}
            </List>
            <Divider orientation="vertical" />
            {hoveredElection && (
              <Card variant="plain" sx={{ width: "24rem", maxWidth: "24rem" }}>
                <Typography level="h3">
                  {hoveredElection.nom_indicateur}
                </Typography>
                <Divider />
                <Typography level="body-md">
                  Source: {hoveredElection.source}
                </Typography>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography level="body-md">Description:</Typography>
                  <Typography level="body-sm">
                    {hoveredElection.description}
                  </Typography>
                </Box>
              </Card>
            )}
          </Sheet>
        </TabPanel>
      </Tabs>
    </ModalDialog>
  );
});

export default ModalComponent;
