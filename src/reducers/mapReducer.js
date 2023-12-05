import { createSlice } from "@reduxjs/toolkit";
import electionServices from "../services/electionServices";

const initialState = {
  1: null,
  2: null,
};

const mapSlice = createSlice({
  name: "maps",
  initialState: initialState,
  reducers: {
    createMap(state, action) {
      const ID = state[1] === null ? 1 : 2;
      return { ...state, [ID]: action.payload };
    },
    deleteMap(state, action) {
      const ID = action.payload;
      return { ...state, [ID]: null };
    },
    createEvolutionMap(state, action) {
      const ID = state[1] !== null ? 1 : 2;
      const oldMap = { ...state[ID] };
      const newMap = action.payload;

      const combinedData = {};

      for (const level in oldMap.resultat) {
        combinedData[level] = {};

        for (const key in oldMap.resultat[level]) {
          const oldValues = oldMap.resultat[level][key];
          const newValues = newMap.resultat[level][key];
          combinedData[level][key] = {};

          for (const code in oldValues) {
            const oldValue = oldValues[code];
            const newValue = newValues[code];
            const percent = (((newValue - oldValue) / oldValue) * 100).toFixed(
              1
            );

            combinedData[level][key][code] = {
              oldValue,
              newValue,
              percent,
            };
          }
        }
      }

      const newState = {
        parti: newMap.parti,
        election: [newMap.election, oldMap.election],
        resultat: combinedData,
        type: "evolution",
      };

      return { ...state, [ID]: { ...newState } };
    },
    setMaps(state, action) {},
  },
});

export const { createMap, deleteMap, createEvolutionMap, setMaps } =
  mapSlice.actions;

export const fetchMapData = (map) => {
  return async (dispatch) => {
    const result = await electionServices.getRequestResults(map);
    let mapObject = { ...map, resultat: {} };

    result.forEach((data) => {
      const { decoupage, variables } = data.data;

      const normalizedVariables = {
        ...variables.reduce((acc, { code_variable, resultat }) => {
          acc[code_variable] = resultat;
          return acc;
        }, {}),
      };
      mapObject = {
        ...mapObject,
        resultat: { ...mapObject.resultat, [decoupage]: normalizedVariables },
        type: "simple",
      };
    });

    dispatch(createMap(mapObject));
  };
};

export const fetchEvolutionData = (map) => {
  return async (dispatch) => {
    const result = await electionServices.getRequestResults(map);
    let mapObject = { ...map, resultat: {} };

    result.forEach((data) => {
      const { decoupage, variables } = data.data;

      const normalizedVariables = {
        ...variables.reduce((acc, { code_variable, resultat }) => {
          acc[code_variable] = resultat;
          return acc;
        }, {}),
      };

      mapObject = {
        ...mapObject,
        resultat: { ...mapObject.resultat, [decoupage]: normalizedVariables },
      };
    });

    dispatch(createEvolutionMap(mapObject));
  };
};

export default mapSlice.reducer;
