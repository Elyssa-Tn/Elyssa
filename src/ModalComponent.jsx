import { Home, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  DialogActions,
  Divider,
  Link,
  List,
  ListDivider,
  ListItemButton,
  ListItemContent,
  Modal,
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
  fetchEvolutionData,
  fetchMapData,
} from "./reducers/mapReducer";
import {
  setModalCompareFlag,
  setModalOpen,
  setReady,
} from "./reducers/interfaceReducer";

const ModalComponent = React.forwardRef(function ModalComponent() {
  const [selectedElection, setSelectedElection] = useState(null);
  const [hoveredElection, setHoveredElection] = useState(null);
  const [selectedParti, setSelectedParti] = useState(null);
  const [hoveredParti, setHoveredParti] = useState(null);

  const init = useSelector((state) => state.elections.init);
  const maps = useSelector((state) => state.maps);
  const loading = useSelector((state) => state.elections.loading);
  const data = useSelector((state) => state.elections.data);
  const modalCompareFlag = useSelector(
    (state) => state.interface.modalCompareFlag
  );

  const [secondModalOpen, setSecondModalOpen] = useState(false);

  const dispatch = useDispatch();

  const electionSelection = (election) => {
    if (!data[election.code_election])
      dispatch(fetchElectionData(election.code_election));
    setSelectedElection(election);
  };

  const partiSelection = (parti) => {
    setSelectedParti(parti);
    if (maps[1] || maps[2]) {
      const keys = [1, 2];
      for (const key of keys) {
        if (maps[key] && maps[key].parti.code_parti === parti.code_parti) {
          setSecondModalOpen(true);
          return;
        }
      }
    }
    console.log(modalCompareFlag);

    if (modalCompareFlag) {
      const request = { election: selectedElection, parti: parti };
      dispatch(setReady(false));
      dispatch(setModalOpen(false));
      dispatch(setModalCompareFlag(false));
      dispatch(fetchCompareMap(request));
    }
    if (!modalCompareFlag) {
      const request = { election: selectedElection, parti: parti };
      dispatch(setReady(false));
      dispatch(setModalOpen(false));
      dispatch(fetchMapData(request));
    }
  };

  const fetchPartiData = () => {
    if (!modalCompareFlag) {
      const request = { election: selectedElection, parti: selectedParti };
      dispatch(setReady(false));
      dispatch(setModalOpen(false));
      dispatch(fetchMapData(request));
    }
    if (modalCompareFlag) {
      const request = { election: selectedElection, parti: selectedParti };
      dispatch(setReady(false));
      dispatch(setModalOpen(false));
      dispatch(setModalCompareFlag(false));
      dispatch(fetchCompareMap(request));
    }
  };

  const handleEvolutionDisplay = () => {
    const request = { election: selectedElection, parti: selectedParti };
    dispatch(fetchEvolutionData(request));
    setSecondModalOpen(false);
    dispatch(setModalOpen(false));
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
                    }}
                  >
                    {data[selectedElection.code_election].partis.map(
                      (parti) => (
                        <Sheet key={parti.code_parti}>
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
                        </Sheet>
                      )
                    )}
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
          <Modal
            open={secondModalOpen}
            onClose={() => setSecondModalOpen(false)}
          >
            <ModalDialog layout="center">
              <Typography>Afficher l'évolution de cet indicateur?</Typography>
              <DialogActions>
                <Button variant="outlined" onClick={fetchPartiData}>
                  Non
                </Button>
                <Button onClick={handleEvolutionDisplay}>Oui</Button>
              </DialogActions>
            </ModalDialog>
          </Modal>
        </TabPanel>
        <TabPanel value={1}>
          <Typography>Indicateurs socio-économiques</Typography>
        </TabPanel>
      </Tabs>
    </ModalDialog>
  );
});

export default ModalComponent;
