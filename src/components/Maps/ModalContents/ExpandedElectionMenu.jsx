import { Box, Button, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import useDataFetch from "../../Utility/useDataFetch";
import { SyncLoader } from "react-spinners";
import SelectionMenu from "./SelectionMenu";
import { Children, useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

function ExpandedElectionMenu({ election, variables, addMap }) {
  const style = {
    display: "flex",
    width: "100%",
    height: "100px",
    backgroundColor: "#333",
  };

  const [activeTab, setActiveTab] = useState(0);
  const [circonscription, setCirconscription] = useState(null);
  const [candidat, setCandidat] = useState(null);
  const [variable, setVariable] = useState(null);
  const [parti, setParti] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const { data, loading, error } = useDataFetch({
    req: {
      type: "election",
      code_election: election["code_election"],
    },
  });

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
      // candidat,
    });
  };

  const displayButton = () => {
    if (!circonscription) {
      return (
        <Button onClick={addMapButton}>
          Ou afficher les resultats regionnaux
        </Button>
      );
    }

    // if (candidat && circonscription) {
    //   return (
    //     <Button onClick={addMapButton}>
    //       Afficher les resultats de {candidat["nom_fr"]} pour{" "}
    //       {circonscription["nom"]}
    //     </Button>
    //   );
    // }

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
      <>
        <span>Explorer les données disponible pour cette election:</span>
        <Box>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Resultats" />
            <Tab label="Partis" />
            <Tab label="Autres variables" />
          </Tabs>
        </Box>
        <TabPanel value={activeTab} index={0}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Box style={style}>
              <SelectionMenu
                placeholder="Filtrez par Circonscription"
                data={data.data.circonscriptions}
                name="nom"
                selector="code_circonscription"
                setSelection={setCirconscription}
              />

              {displayButton()}
            </Box>
          </div>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <SelectionMenu
            placeholder="Filtrez par Partie"
            data={data.data.partis}
            name="denomination_fr"
            selector="code_parti"
            setSelection={setParti}
          />
          {parti && (
            <Button
              onClick={() =>
                addMap({
                  election,
                  parti,
                })
              }
            >
              Afficher les resultats du parti {parti["denomination_fr"]}
            </Button>
          )}
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Box style={{ display: "flex", flexDirection: "row" }}>
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
          </Box>
        </TabPanel>
      </>
    );
  }
}

export default ExpandedElectionMenu;
