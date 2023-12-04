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
    setMaps(state, action) {},
  },
});

export const { createMap, deleteMap, setMaps } = mapSlice.actions;

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
      };
    });

    dispatch(createMap(mapObject));
  };
};

export default mapSlice.reducer;
