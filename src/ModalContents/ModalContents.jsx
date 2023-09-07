import { useState } from "react";
// import { Autocomplete, Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CircularProgress from "@mui/joy/CircularProgress";
import ExpandedElectionMenu from "./ExpandedElectionMenu";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Autocomplete,
  Box,
  TextField,
  accordionClasses,
} from "@mui/joy";
import { fetchElectionData } from "../reducers/electionReducer";

const ModalContents = (props) => {
  const dispatch = useDispatch();

  const elections = useSelector((state) => state.elections.init.elections);

  const electionData = useSelector((state) => state.elections);

  const [selectedElection, setSelectedElection] = useState(null);

  const style = {
    // position: "relative",
    // width: "300px",
    // minWidth: "300px",
    // backgroundColor: "rgb(250, 235, 215)",
    border: "2px solid #000",
    margin: "4px",
    padding: "8px",
  };

  const expandElection = (election) => {
    if (!electionData[election]) dispatch(fetchElectionData(election));
  };

  return (
    <Box style={style}>
      <Box style={{ display: "flex", flexDirection: "row" }}>
        {/* <Autocomplete
          autoSelect
          options={elections}
          getOptionLabel={(option) => option["nom"]}
          value={selectedElection}
          onChange={(event, newValue) => {
            setSelectedElection(null);
            setTimeout(() => {
              setSelectedElection(newValue);
            }, 100);
          }}
          // renderInput={(params) => (
          //   <TextField {...params} label="Choisissez une election" />
          // )}
          sx={{
            // width: "90%",
            // backgroundColor: "rgb(250, 235, 215)",
            padding: 2,
          }}
        /> */}
        {/* {selectedElection && (
          <IconButton onClick={landingMaps}>
            <DoubleArrowIcon />
          </IconButton>
        )} */}
      </Box>
      <AccordionGroup
        size="sm"
        sx={{
          // maxHeight: 300,
          overflow: "scroll",
          [`& .${accordionClasses.root}`]: {
            marginTop: "0.5rem",
            transition: "0.2s ease",
            '& button:not([aria-expanded="true"])': {
              transition: "0.2s ease",
              paddingBottom: "0.625rem",
            },
            "& button:hover": {
              background: "transparent",
            },
          },
          [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
            bgcolor: "background.level1",
            borderRadius: "md",
            borderBottom: "1px solid",
            borderColor: "background.level2",
          },
          '& [aria-expanded="true"]': {
            boxShadow: (theme) =>
              `inset 0 -1px 0 ${theme.vars.palette.divider}`,
          },
        }}
      >
        {elections.map((election) => {
          return (
            <Accordion
              key={election.code_election}
              onChange={(event, expanded) => {
                expandElection(election.code_election);
              }}
            >
              <AccordionSummary>{election.nom}</AccordionSummary>
              <AccordionDetails>
                {electionData[election.code_election] ? (
                  "found"
                ) : (
                  <CircularProgress />
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </AccordionGroup>
      {selectedElection && (
        <ExpandedElectionMenu selectedElection={selectedElection} />
      )}
    </Box>
  );
};

export default ModalContents;
