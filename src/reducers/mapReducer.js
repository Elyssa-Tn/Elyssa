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

        for (const code in oldMap.resultat[level]) {
          const oldValues = oldMap.resultat[level][code];
          const newValues = newMap.resultat[level][code];
          combinedData[level][code] = {};

          let percent;

          if (oldValues && newValues)
            percent = (
              ((newValues.prc - oldValues.prc) / oldValues.prc) *
              100
            ).toFixed(1);

          combinedData[level][code] = {
            code_parti: oldValues.code_parti,
            nom_fr: oldValues.nom_fr,
            oldprc: oldValues.prc,
            oldvoix: oldValues.voix,
            oldvotes: oldValues.votes,
            newprc: newValues ? newValues.prc : null,
            newvoix: newValues ? newValues.voix : null,
            newvotes: newValues ? newValues.votes : null,
            percent,
          };
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
      const object = {};

      variables[0].resultat.forEach((resultat) => {
        const { code_unite, ...data } = resultat;
        object[code_unite] = data;
      });

      mapObject = {
        ...mapObject,
        resultat: { ...mapObject.resultat, [decoupage]: object },
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
      const object = {};

      variables[0].resultat.forEach((resultat) => {
        const { code_unite, ...data } = resultat;
        object[code_unite] = data;
      });

      mapObject = {
        ...mapObject,
        resultat: { ...mapObject.resultat, [decoupage]: object },
        type: "simple",
      };
    });

    dispatch(createEvolutionMap(mapObject));
  };
};

export default mapSlice.reducer;
