import { Box, Button } from "@mui/material";
import useDataFetch from "../../Utility/useDataFetch";
import { SyncLoader } from "react-spinners";
import SelectionMenu from "./SelectionMenu";
import { Children, useState } from "react";

function ExpandedElectionMenu({ election, variables, addMap }) {
  const [circonscription, setCirconscription] = useState(null);
  const [partie, setPartie] = useState(null);
  const [variable, setVariable] = useState(null);

  const { data, loading, error } = useDataFetch({
    req: {
      type: "election",
      code_election: election["code_election"],
    },
  });

  const style = {
    display: "flex",
    width: "100%",
    height: "100px",
    backgroundColor: "#333",
  };

  if (loading) {
    return (
      <Box style={style}>
        <SyncLoader
          style={{
            position: "absolute",
            bottom: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </Box>
    );
  }

  const addMapButton = () => {
    addMap({
      election,
      circonscription,
      partie,
      variable,
    });
  };

  const displayButton = () => {
    if (!circonscription) {
      return <Button onClick={addMapButton}>Afficher les resultats</Button>;
    }

    if (partie && circonscription) {
      return (
        <Button onClick={addMapButton}>
          Afficher les resultats de {partie["nom_fr"]} pour{" "}
          {circonscription["nom"]}
        </Button>
      );
    }

    if (circonscription) {
      return (
        <Button onClick={addMapButton}>
          Afficher les resultats pour {circonscription["nom"]}
        </Button>
      );
    }
  };

  if (data) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Box style={style}>
          <SelectionMenu
            placeholder="Filtrez par Circonscription"
            data={data.data.circonscriptions}
            name="nom"
            selector="code_circonscription"
            setSelection={setCirconscription}
          />
          {circonscription && (
            <SelectionMenu
              placeholder="Filtrez par Partie"
              data={circonscription.candidats}
              name="nom_fr"
              selector="code_candidat"
              setSelection={setPartie}
            />
          )}
          {displayButton()}
        </Box>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <SelectionMenu
            placeholder="Selectionnez une variable"
            data={variables}
            name="nom"
            selector="code_variable"
            setSelection={setVariable}
          />
          {variable && (
            <Button onClick={() => addMap({ election, variable })}>
              Afficher variable
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default ExpandedElectionMenu;
