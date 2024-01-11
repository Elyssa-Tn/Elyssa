import { useEffect, useState } from "react";
import * as L from "leaflet";
import {
  Button,
  CircularProgress,
  CssBaseline,
  CssVarsProvider,
  Divider,
  Modal,
  Sheet,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { initializeElections } from "./reducers/electionReducer";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

import Layout from "./Layout";
import MapCard from "./MapCard/MapCard";
import Navbar from "./NavbarTemporary";
import MapTitle from "./MapTitle";
import theme from "./theme";
import { getGeoJSON } from "./services/geojson";
import {
  setClassNumber,
  setLevel,
  setMinMax,
  setReady,
  toggleCompare,
} from "./reducers/interfaceReducer";
import MapsContainer from "./MapsContainer";

function App() {
  const materialTheme = materialExtendTheme();

  const dispatch = useDispatch();

  const init = useSelector((state) => state.elections.init);
  const levels = useSelector((state) => state.interface.levels);
  const ready = useSelector((state) => state.interface.ready);
  const modalOpen = useSelector((state) => state.interface.modalOpen);
  const classNumber = useSelector((state) => state.interface.classNumber);
  const compare = useSelector((state) => state.interface.compareToggle);

  const [bounds, setBounds] = useState(null);
  const [autocompleteOptions, setAutocompleteOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  const maps = useSelector((state) => state.maps);

  // function findMinMaxValues(maps, valueProperty) {
  //   const result = {};
  //   for (const key in maps) {
  //     if (maps[key] && maps[key].resultat) {
  //       result[key] = {
  //         delegation: {
  //           min: Infinity,
  //           max: -Infinity,
  //         },
  //         gouvernorat: {
  //           min: Infinity,
  //           max: -Infinity,
  //         },
  //         region: {
  //           min: Infinity,
  //           max: -Infinity,
  //         },
  //       };
  //       const data = maps[key].resultat;
  //       for (const level in data) {
  //         for (const code in data[level]) {
  //           const value = data[level][code][valueProperty];
  //           if (!isNaN(value)) {
  //             if (value < result[key][level].min) {
  //               result[key][level].min = value;
  //             }
  //             if (value > result[key][level].max) {
  //               result[key][level].max = value;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   if (result[1] && result[2]) {
  //     result[3] = {
  //       delegation: {
  //         min: Math.min(result[1].delegation.min, result[2].delegation.min),
  //         max: Math.max(result[1].delegation.max, result[2].delegation.max),
  //       },
  //       gouvernorat: {
  //         min: Math.min(result[1].gouvernorat.min, result[2].gouvernorat.min),
  //         max: Math.max(result[1].gouvernorat.max, result[2].gouvernorat.max),
  //       },
  //       region: {
  //         min: Math.min(result[1].region.min, result[2].region.min),
  //         max: Math.max(result[1].region.max, result[2].region.max),
  //       },
  //     };
  //   }

  //   return result;
  // }

  function findMinMaxValues(maps, valueProperty, levels) {
    const result = {};
    for (const key in maps) {
      if (maps[key] && maps[key].resultat) {
        result[key] = {};
        levels.forEach((level) => {
          result[key][level] = {
            min: Infinity,
            max: -Infinity,
          };
        });

        const data = maps[key].resultat;
        for (const currentLevel in data) {
          for (const code in data[currentLevel]) {
            const value = data[currentLevel][code][valueProperty];
            if (!isNaN(value)) {
              if (value < result[key][currentLevel].min) {
                result[key][currentLevel].min = value;
              }
              if (value > result[key][currentLevel].max) {
                result[key][currentLevel].max = value;
              }
            }
          }
        }
      }
    }

    if (result[1] && result[2]) {
      result[3] = {};
      levels.forEach((level) => {
        result[3][level] = {
          min: Math.min(result[1][level].min, result[2][level].min),
          max: Math.max(result[1][level].max, result[2][level].max),
        };
      });
    }

    return result;
  }

  const calculateClasses = (data) => {
    const classNumber = {};

    for (const key in data) {
      classNumber[key] = {};

      for (const level in data[key]) {
        const min = data[key][level].min;
        const max = data[key][level].max;

        const dataRange = max - min;
        const minClasses = Math.max(5, Math.ceil(dataRange / 12));

        classNumber[key][level] = minClasses;
      }
    }

    return classNumber;
  };

  useEffect(() => {
    const processMap = (map, property) => {
      if (map) {
        const minMax = findMinMaxValues(maps, property, levels);
        const classNumber = calculateClasses(minMax);
        if (map.type === "indicator") dispatch(setLevel("delegation"));
        dispatch(setClassNumber(classNumber));
        dispatch(setMinMax(minMax));
      }
    };

    if (maps[1] || maps[2]) {
      processMap(
        maps[1],
        maps[1]?.type === "simple"
          ? "prc"
          : maps[1]?.type === "evolution" || maps[1]?.type === "comparaison"
          ? "percent"
          : maps[1]?.type === "indicator"
          ? "valeur"
          : maps[1]?.type === "TP"
          ? "tp"
          : null
      );
      processMap(
        maps[2],
        maps[2]?.type === "simple"
          ? "prc"
          : maps[2]?.type === "evolution" || maps[2]?.type === "comparaison"
          ? "percent"
          : maps[2]?.type === "indicator"
          ? "valeur"
          : null
      );

      dispatch(toggleCompare(!!(maps[1] && maps[2])));
      dispatch(setReady(true));
    }
  }, [maps, dispatch]);

  const [geojson, setGeojson] = useState({});

  useEffect(() => {
    const fetchAndUseGeoJSON = async (level) => {
      try {
        const map = await getGeoJSON(level);
        return { [level]: map };
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };

    Promise.all(levels.map(fetchAndUseGeoJSON))
      .then((results) => {
        const formattedResults = {};
        results.forEach((entry) => {
          const key = Object.keys(entry)[0];
          formattedResults[key] = entry[key];
        });
        setGeojson(formattedResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const calculateBounds = async () => {
      const boundsObject = {};

      for (const mapName in geojson) {
        if (geojson.hasOwnProperty(mapName)) {
          boundsObject[mapName] = {};

          const geoJSON = geojson[mapName];

          geoJSON.features.forEach((feature) => {
            const code = feature.properties[`code_${mapName}`];

            const geometryType = feature.geometry.type;
            let bounds;

            const polygons =
              geometryType === "Polygon"
                ? [feature.geometry.coordinates]
                : feature.geometry.coordinates;

            const latLngs = [];
            for (const polygon of polygons) {
              for (const ring of polygon) {
                latLngs.push(
                  ...ring.map((coord) => L.latLng(coord[1], coord[0]))
                );
              }
            }

            bounds = L.latLngBounds(latLngs);

            boundsObject[mapName][code] = {
              name: feature.properties[`nom_${mapName}`],
              bounds,
            };
          });
        }

        if (Object.keys(boundsObject).length === levels.length) {
          setBounds(boundsObject);
        }
      }

      //TODO: Remove this eventually
      const flattenBounds = (bounds) => {
        const flattenedOptions = [];

        for (const levelKey in bounds) {
          const level = bounds[levelKey];

          for (const optionKey in level) {
            const option = level[optionKey];
            flattenedOptions.push({
              label: option.name,
              key: optionKey,
              level: levelKey,
            });
          }
        }

        return flattenedOptions;
      };

      const flattenedBounds = flattenBounds(boundsObject);
      setAutocompleteOptions(flattenedBounds);
    };

    if (geojson) calculateBounds();
  }, [geojson]);

  useEffect(() => {
    dispatch(initializeElections());
  }, [dispatch]);

  if (loading)
    return (
      <Sheet
        variant="soft"
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Sheet>
    );

  if (init)
    return (
      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
        <CssVarsProvider theme={theme}>
          <CssBaseline />
          <Layout.Root>
            <Layout.Header>
              <Navbar />
            </Layout.Header>
            {/* <Layout.TopPanel>
              {maps[1] || maps[2] ? null : (
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => dispatch(setModalOpen(true))}
                >
                  Open
                </Button>
              )}
              <Modal
                open={modalOpen}
                onClose={() => dispatch(setModalOpen(false))}
              >
                <ModalComponent />
              </Modal>
              {maps[1] && (
                <MapTitle
                  electionInfo={maps[1]["election"]}
                  parti={maps[1]["parti"]}
                  indicator={maps[1]["indicator"]}
                />
              )}
              {maps[2] && (
                <MapTitle
                  electionInfo={maps[2]["election"]}
                  parti={maps[2]["parti"]}
                />
              )}
            </Layout.TopPanel> */}
            <Layout.Main>
              <Sheet
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {maps[1] && classNumber[1] && (
                  // <MapCard
                  //   // map={map[1]}
                  //   // electionInfo={map[1]["election"]}
                  //   geojson={geojson}
                  //   bounds={bounds}
                  //   autocompleteOptions={autocompleteOptions}
                  //   ID={1}
                  // />
                  <MapsContainer
                    geojson={geojson}
                    bounds={bounds}
                    autocompleteOptions={autocompleteOptions}
                    ID={1}
                  />
                )}

                {maps[2] && classNumber[2] && (
                  <>
                    <Divider orientation="vertical" />
                    {/* <MapCard
                      // map={map[2]}
                      // electionInfo={map[2]["election"]}
                      geojson={geojson}
                      bounds={bounds}
                      autocompleteOptions={autocompleteOptions}
                      ID={2}
                    /> */}
                    <MapsContainer
                      geojson={geojson}
                      bounds={bounds}
                      autocompleteOptions={autocompleteOptions}
                      ID={2}
                    />
                  </>
                )}
              </Sheet>
            </Layout.Main>
          </Layout.Root>
        </CssVarsProvider>
      </MaterialCssVarsProvider>
    );
}

export default App;
