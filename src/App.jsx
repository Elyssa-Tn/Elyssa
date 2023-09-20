import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeElections } from "./reducers/electionReducer";

import Layout from "./Layout";
import ModalContents from "./ModalContents/ModalContents";
import MapCard from "./MapCard/MapCard2";
import Navbar from "./Navbar";
import {
  Box,
  CssBaseline,
  CssVarsProvider,
  Sheet,
  Slider,
  Switch,
  Typography,
} from "@mui/joy";
import theme from "./theme";

function App() {
  const dispatch = useDispatch();

  const init = useSelector((state) => state.elections.init);

  // const maps = useSelector((state) => state.maps.maps);
  const map = [
    {
      election: {
        pays: "Tunisie",
        type_election: "TNMUN",
        mode_scrutin: "Proportionnel",
        nombre_tours: 1,
        uninominal_liste: "Scrutin de listes",
        age_minimum_electeur: 18,
        age_maximum_electeur: null,
        territorial_national: false,
        partiel_general: "Générale",
        age_minimum_candidat: 23,
        age_maximum_candidat: null,
        militaires: null,
        juges: null,
        autres_exclus: null,
        parite: null,
        jeunesse: null,
        debut: "2018-05-06",
        fin: "2018-05-06",
        date_campagne: "2018-04-14",
        date_decret_officiel: "2018-05-04",
        date_loi_electorale: "2014-05-26",
        date_constitution: "2014-02-10",
        date_planifiee: "2017-12-17",
        description: "",
        silence: "2018-05-05",
        code_election: "tnmun2018",
        nom: "Elections municipales 2018",
        nombre_sieges: null,
        rcno: 8,
        decoupage_minimum: "commune",
        decoupage_maximum: "delegation",
        decoupages_consultables: null,
        version_administratif: null,
      },
      level: null,
      parti: {
        code_parti: "NIDA",
        denomination: null,
        type: null,
        groupement: null,
        an_creation: null,
        pays: "Tunisie",
        rcno: 20,
        description: null,
        sigle: null,
        logo: null,
        classement_politique: null,
        denomination_ar: "حركة نداء تونس",
        denomination_fr: "Nidaa Tounes",
      },
    },
    {
      data: {
        type: "data",
        code_election: "tnmun2018",
        decoupage: "gouvernorat",
        variables: [
          {
            code_variable: "prc",
            code_parti: "NIDA",
            resultat: {
              11: 26.17,
              12: 20.9,
              13: 20.41,
              14: 22.48,
              15: 22.18,
              16: 19.48,
              17: 20,
              21: 24.05,
              22: 30.95,
              23: 30.5,
              24: 18.16,
              31: 21.21,
              32: 22.21,
              33: 24.18,
              34: 19.28,
              41: 21.46,
              42: 23.69,
              43: 20.52,
              51: 13.76,
              52: 12.08,
              53: 11.53,
              61: 16.94,
              62: 12.08,
              63: 10.9,
              Total: 21,
            },
          },
          {
            code_variable: "voix",
            code_parti: "NIDA",
            resultat: {
              11: 37460,
              12: 16357,
              13: 19752,
              14: 11256,
              15: 34197,
              16: 6986,
              17: 15061,
              21: 10579,
              22: 15308,
              23: 12553,
              24: 6897,
              31: 24238,
              32: 26934,
              33: 17538,
              34: 31872,
              41: 17721,
              42: 19891,
              43: 14955,
              51: 8222,
              52: 9269,
              53: 1909,
              61: 10687,
              62: 2853,
              63: 3391,
              Total: 375886,
            },
          },
        ],
      },
    },
  ];

  const [toggleLayer, setToggleLayer] = useState(false);
  const [fillValue, setFillValue] = useState(9);
  const [classNumber, setclassNumber] = useState(5);

  useEffect(() => {
    dispatch(initializeElections());
  }, [dispatch]);

  if (init)
    return (
      // <CssVarsProvider theme={theme}>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Layout.Root
          sx={{
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(64px, 200px) minmax(450px, 1fr)",
              md: "minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)",
            },
          }}
        >
          <Layout.Header>
            <Navbar />
          </Layout.Header>
          <Layout.SidePanel>
            <ModalContents />
          </Layout.SidePanel>
          <Layout.Main>
            {/* {maps &&
              maps.map((mapObject) => {
                const [ID, map] = Object.entries(mapObject)[0];
                return (
                  <MapCard
                    key={ID}
                    id={ID}
                    map={map[1]}
                    electionInfo={map[0]}
                  />
                );
              })} */}
            <MapCard
              map={map[1]}
              electionInfo={map[0]}
              toggleLayer={toggleLayer}
              fillValue={fillValue}
              classNumber={classNumber}
            />
          </Layout.Main>
          {/* Demo start */}
          <Sheet
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: 4,
                justifyContent: "space-between",
              }}
            >
              <Typography>Carte Satellite:</Typography>{" "}
              <Switch
                checked={toggleLayer}
                onChange={(event) => setToggleLayer(event.target.checked)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: 4,
                justifyContent: "space-between",
              }}
            >
              <Typography>Transparence:</Typography>{" "}
              <Slider
                marks
                valueLabelDisplay="on"
                value={fillValue}
                onChange={(event) => setFillValue(event.target.value)}
                max={10}
                sx={{ width: 260 }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: 4,
                justifyContent: "space-between",
              }}
            >
              <Typography>Nombre de classes:</Typography>{" "}
              <Slider
                marks
                valueLabelDisplay="on"
                value={classNumber}
                onChange={(event) => setclassNumber(event.target.value)}
                min={4}
                max={12}
                sx={{ width: 260 }}
              />
            </Box>
          </Sheet>
        </Layout.Root>
      </CssVarsProvider>
    );
}

export default App;
