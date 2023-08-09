import { useState } from "react";
import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
// import CircularProgress from "@mui/material/CircularProgress";
import ExpandedElectionMenu from "./ExpandedElectionMenu";

const ModalContents = (props) => {
  const dispatch = useDispatch();

  const elections = useSelector((state) => state.elections.init.elections);

  const [selectedElection, setSelectedElection] = useState(null);

  const style = {
    position: "relative",
    width: "300px",
    minWidth: "300px",
    backgroundColor: "rgb(250, 235, 215)",
    border: "2px solid #000",
    margin: "4px",
    padding: "8px",
  };

  // useEffect(() => {
  //   if (selectedElection) {
  //     landingMaps();
  //   }
  // }, [selectedElection]);

  // const landingMaps = () => {
  //   addMap({
  //     election: selectedElection,
  //     variable: { code_variable: "tp", nom: "Taux de participation" },
  //   });
  // };

  // if (loading) {
  //   return (
  //     <CircularProgress
  //       style={{
  //         position: "relative",
  //         top: "20px",
  //         // left: "20%",
  //       }}
  //     />
  //   );
  // }

  // if (data.errors) {
  //   return <span>Erreur: {data.errors[0].message}</span>;
  // }

  return (
    <Box style={style}>
      {" "}
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Autocomplete
          autoSelect
          disablePortal
          options={elections}
          getOptionLabel={(option) => option["nom"]}
          value={selectedElection}
          onChange={(event, newValue) => {
            setSelectedElection(null);
            setTimeout(() => {
              setSelectedElection(newValue);
            }, 100);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choisissez une election" />
          )}
          sx={{
            width: "90%",
            backgroundColor: "rgb(250, 235, 215)",
            padding: 2,
          }}
        />{" "}
        {/* {selectedElection && (
            <IconButton onClick={landingMaps}>
              <DoubleArrowIcon />
            </IconButton>
          )} */}
      </Box>
      {selectedElection && (
        <ExpandedElectionMenu selectedElection={selectedElection} />
      )}
    </Box>
  );
};

export default ModalContents;
