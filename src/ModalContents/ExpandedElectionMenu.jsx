// import {
//   Autocomplete,
//   Box,
//   Button,
//   TextField,
// } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// import SelectionMenu from "./SelectionMenu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchElectionData } from "../reducers/electionReducer";
import { fetchMapData } from "../reducers/mapReducer";
import { Autocomplete, Box, Button, TextField } from "@mui/joy";

function ExpandedElectionMenu({ selectedElection }) {
  const style = {
    display: "flex",
    width: "100%",
    height: "100px",
    backgroundColor: "rgb(250, 235, 215)",
  };
  const dispatch = useDispatch();

  const election = useSelector(
    (state) => state.elections[selectedElection.code_election]
  );
  const variables = useSelector((state) => state.elections.init.variables);

  // const partis = useSelector((state) =>
  //   state.elections.init.partis.filter((parti) => parti)
  // );

  useEffect(() => {
    if (!election) dispatch(fetchElectionData(selectedElection.code_election));
  }, []);

  const [level, setLevel] = useState(null);
  const [circonscription, setCirconscription] = useState(null);
  const [candidat, setCandidat] = useState(null);
  const [variable, setVariable] = useState(null);
  const [parti, setParti] = useState(null);

  // const { data, loading, error } = useDataFetch({
  //   req: {
  //     type: "election",
  //     code_election: election["code_election"],
  //   },
  // });

  // const fetchDataFromAPI = async () => {
  //   const newData = await useDataFetch({
  //     req: {
  //       type: "election",
  //       code_election: election["code_election"],
  //     },
  //   });
  //   return newData;
  // };

  // fetchDataFromAPI()

  // const levels = election.decoupage_disponible
  //   ? election.decoupage_disponible
  //   : [
  //       { code: "gouvernorat", nom: "Gouvernorat" },
  //       { code: "delegation", nom: "Delegation" },
  //       { code: "circonscription", nom: "Circonscription" },
  //       { code: "commune", nom: "Commune" },
  //       { code: "secteur", nom: "Secteur" },
  //     ];

  const levels = [
    { code: "gouvernorat", nom: "Gouvernorat" },
    { code: "delegation", nom: "Delegation" },
    // { code: "circonscriptions", nom: "Circonscription" },
    { code: "commune", nom: "Commune" },
    { code: "secteur", nom: "Secteur" },
  ];

  const addMap = (mapObject) => {
    dispatch(fetchMapData(mapObject));
  };

  // if (loading) {
  //   return (
  //     <Box style={style}>
  //       <CircularProgress
  //         style={{
  //           position: "absolute",
  //           bottom: "20%",
  //           left: "50%",
  //           transform: "translate(-50%, -50%)",
  //         }}
  //       />
  //     </Box>
  //   );
  // }

  const addMapButton = () => {
    addMap({
      election: selectedElection,
      circonscription,
      level,
      // candidat,
      variable,
    });
  };

  // const filteredVariables = variables.filter(
  //   (variable) => variable.code_variable === "tp"
  // );

  // const filteredParties = data.data.partis.filter((parti) => parti);

  const displayButton = () => {
    if (variable) {
      return (
        <Button onClick={addMapButton}>
          Afficher les resultats pour {variable["nom"]}
        </Button>
      );
    }

    if (parti && circonscription) {
      return (
        <Button onClick={addMapButton}>
          Afficher les resultats de {parti["denomination_fr"]} pour{" "}
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

    if (parti) {
      return (
        <Button
          onClick={() => {
            addMap({
              election: selectedElection,
              level,
              parti,
            });
          }}
        >
          Afficher les resultats du parti {parti["denomination_fr"]}
        </Button>
      );
    }

    if (!circonscription) {
      return (
        <Button
          onClick={() =>
            addMap({
              election,
              chart: true,
            })
          }
        >
          Afficher les resultats de tout les partis
        </Button>
      );
    }
  };

  if (election) {
    return (
      <>
        <Box>
          <Autocomplete
            options={variables}
            getOptionLabel={(option) => option["nom"]}
            value={variable}
            onChange={(event, newValue) => setVariable(newValue)}
            // renderInput={(params) => (
            //   <TextField {...params} label="Selectionnez une variable" />
            // )}
            sx={{
              width: "90%",
              backgroundColor: "rgb(250, 235, 215)",
              padding: 2,
            }}
          />
          <Autocomplete
            options={election.data.partis.filter((parti) => parti)}
            getOptionLabel={(option) => option["denomination_fr"]}
            value={parti}
            onChange={(event, newValue) => setParti(newValue)}
            // renderInput={(params) => (
            //   <TextField {...params} label="Selectionnez un parti" />
            // )}
            sx={{
              width: "90%",
              backgroundColor: "rgb(250, 235, 215)",
              padding: 2,
            }}
          />
          <Box style={{ display: "flex", flexDirection: "row" }}>
            <Autocomplete
              options={levels}
              sx={{
                width: "90%",
                backgroundColor: "rgb(250, 235, 215)",
                padding: 2,
              }}
              getOptionLabel={(option) => option["nom"]}
              value={level}
              defaultValue={levels[0]}
              onChange={(event, newValue) =>
                newValue.code === "circonscription" &&
                election.code_election === "tnmun2018"
                  ? setLevel(levels[3])
                  : setLevel(newValue)
              }
              // renderInput={(params) => (
              //   <TextField
              //     {...params}
              //     label="Filtrez par niveau geographique"
              //   />
              // )}
            />
            {/* <SelectionMenu
              placeholder="Filtrez par niveau geographique"
              data={levels}
              name="nom"
              selector="code"
              setSelection={setLevel}
            /> */}
          </Box>
          <Box>
            {/* <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Resultats" />
              <Tab label="Partis" />
              <Tab label="Autres variables" />
            </Tabs> */}
          </Box>
          {/* <TabPanel value={activeTab} index={0}> */}
          {/* <div style={{ display: "flex", flexDirection: "column" }}>
            <Box style={style}>
              <SelectionMenu
                placeholder="Filtrez par Circonscription"
                data={data.data.circonscriptions}
                name="nom"
                selector="code_circonscription"
                setSelection={setCirconscription}
              />
            </Box>
          </div> */}
          {/* </TabPanel> */}
          {/* <TabPanel value={activeTab} index={1}> */}
          {/* {parti && (
            <Button
              onClick={() =>
                addMap({
                  election,
                  level,
                  parti,
                })
              }
            >
              Afficher les resultats du parti {parti["denomination_fr"]}
            </Button>

          )} */}
          {/* </TabPanel> */}
          {/* <TabPanel value={activeTab} index={2}> */}
          {/* <Box style={{ display: "flex", flexDirection: "row" }}>
            <SelectionMenu
              placeholder="Selectionnez une variable"
              data={variables}
              name="nom"
              selector="code_variable"
              setSelection={setVariable}
            />
            {variable && (
              <Button onClick={() => addMap({ election, level, variable })}>
                Afficher variable
              </Button>
            )}
          </Box> */}
          {/* </TabPanel> */}
          {displayButton()}
        </Box>
      </>
    );
  }
}

export default ExpandedElectionMenu;
