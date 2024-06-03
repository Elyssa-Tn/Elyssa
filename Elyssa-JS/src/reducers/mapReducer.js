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
    createComparaisonMap(state, action) {
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
            percent = (newValues.prc - oldValues.prc).toFixed(1);

          combinedData[level][code] = {
            old_parti: oldValues.code_parti,
            nom_fr: oldValues.nom_fr,
            oldprc: oldValues.prc,
            oldvoix: oldValues.voix,
            oldvotes: oldValues.votes,
            new_parti: newValues ? newValues.code_parti : null,
            newprc: newValues ? newValues.prc : null,
            newvoix: newValues ? newValues.voix : null,
            newvotes: newValues ? newValues.votes : null,
            percent,
          };
        }
      }

      const newState = {
        parti: [oldMap.parti, newMap.parti],
        election: [oldMap.election, newMap.election],
        resultat: combinedData,
        type: "comparaison",
      };

      return { ...state, [ID]: { ...newState } };
    },
  },
});

export const {
  createMap,
  deleteMap,
  createEvolutionMap,
  createComparaisonMap,
} = mapSlice.actions;

//TODO: refactor this

const fetchDataAndDispatch = async (map, dispatch, createAction, service) => {
  const result = await service(map);

  let mapObject = { ...map, resultat: {} };

  result.forEach((data) => {
    const { decoupage } = data.data.req;
    const { variables } = data.data.result[0];
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

  dispatch(createAction(mapObject));
};

export const fetchMapData = (map) => {
  return async (dispatch) => {
    await fetchDataAndDispatch(
      map,
      dispatch,
      createMap,
      electionServices.getRequestResults
    );
  };
};

export const fetchEvolutionData = (map) => {
  return async (dispatch) => {
    await fetchDataAndDispatch(
      map,
      dispatch,
      createEvolutionMap,
      electionServices.getRequestResults
    );
  };
};

export const fetchCompareMap = (map) => {
  return async (dispatch) => {
    await fetchDataAndDispatch(
      map,
      dispatch,
      createComparaisonMap,
      electionServices.getRequestResults
    );
  };
};

export const fetchIndicatorMap = (map) => {
  return async (dispatch) => {
    const { data } = await electionServices.getIndicatorResults(map);
    const { decoupage } = data.req;
    const object = {};

    data.result.forEach((resultat) => {
      const { code_unite, ...data } = resultat;
      object[code_unite] = data;
    });

    const mapObject = {
      indicator: { ...map },
      resultat: { [decoupage]: object },
      type: "indicator",
    };

    dispatch(createMap(mapObject));
  };
};

export const fetchTpMap = (map) => {
  return async (dispatch) => {
    const result = await electionServices.getTpResult(map);

    let mapObject = { ...map, resultat: {} };

    result.forEach((data) => {
      const { decoupage } = data.data.req;
      const { variables } = data.data.result[0];
      const object = {};

      variables[0].resultat.forEach((resultat) => {
        const { code_unite, ...data } = resultat;
        object[code_unite] = data;
      });

      mapObject = {
        ...mapObject,
        resultat: { ...mapObject.resultat, [decoupage]: object },
        type: "TP",
      };
    });

    const { data } = await electionServices.getTotalTpResult(map);
    if (data)
      mapObject = {
        ...mapObject,
        tp: data.result[0].variables[0].resultat[0],
      };

    dispatch(createMap(mapObject));
  };
};

export default mapSlice.reducer;
