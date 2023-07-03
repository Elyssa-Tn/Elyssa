import { forwardRef, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SyncLoader } from "react-spinners";
import SelectionMenu from "./SelectionMenu";
import ListElectionsForType from "./ListElectionsForType";
import ExpandedElectionMenu from "./ExpandedElectionMenu";

const ModalContents = forwardRef((props, ref) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedElection, setSelectedElection] = useState(null);

  const { data, loading, error, addMap } = props;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    backgroundColor: "#333",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  if (loading) {
    return <SyncLoader />;
  }

  if (data) {
    return (
      <Box style={style}>
        <SelectionMenu
          placeholder="Choisissez un type d'election"
          data={data.data.type_election}
          setSelection={setSelectedType}
          selector={"type_election"}
          name={"denomination"}
        />
        {selectedType && (
          <ListElectionsForType
            elections={data.data.elections}
            setSelectedElection={setSelectedElection}
            selectedType={selectedType["type_election"]}
          />
        )}
        {selectedElection && (
          <ExpandedElectionMenu
            election={selectedElection}
            variables={data.data.variables}
            addMap={addMap}
          />
        )}
      </Box>
    );
  }
});

ModalContents.displayName = "ModalContents";
export default ModalContents;
