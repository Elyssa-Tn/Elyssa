import { Home, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Link,
  List,
  ListDivider,
  ListItemButton,
  ListItemContent,
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
import { fetchMapData } from "./reducers/mapReducer";
import { setModalOpen, setReady } from "./reducers/interfaceReducer";

const ModalComponent = React.forwardRef(function ModalComponent() {
  const [selectedElection, setSelectedElection] = useState(null);
  const [hoveredElection, setHoveredElection] = useState(null);
  const [selectedParti, setSelectedParti] = useState(null);
  const [hoveredParti, setHoveredParti] = useState(null);

  const init = useSelector((state) => state.elections.init);
  const loading = useSelector((state) => state.elections.loading);
  const data = useSelector((state) => state.elections.data);

  const dispatch = useDispatch();

  const electionSelection = (election) => {
    dispatch(fetchElectionData(election.code_election));
    setSelectedElection(election);
  };

  const partiSelection = (parti) => {
    const request = { election: selectedElection, parti: parti };
    dispatch(setReady(false));
    dispatch(setModalOpen(false));
    dispatch(fetchMapData(request));
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
          <Tab>Données électorales</Tab>
          <Tab>Indicateurs socio-économiques</Tab>
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
        </TabPanel>
        <TabPanel value={1}>
          <Typography>Indicateurs socio-économiques</Typography>
        </TabPanel>
      </Tabs>
    </ModalDialog>
  );
});

export default ModalComponent;
