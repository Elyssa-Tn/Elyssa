import { createSlice } from "@reduxjs/toolkit";
import electionServices from "../services/electionServices";

const mapSlice = createSlice({
  name: "maps",
  initialState: null,
  reducers: {
    createMap(state, action) {},
    deleteMap(state, action) {},
    setMaps(state, action) {
      return action.payload;
    },
  },
});

export const { createMap, deleteMap, setMaps } = mapSlice.actions;

export const fetchMapData = (map) => {
  return async (dispatch) => {
    const result = await electionServices.getRequestResults(map);
    dispatch(createMap([map, result]));
  };
};

export default mapSlice.reducer;
