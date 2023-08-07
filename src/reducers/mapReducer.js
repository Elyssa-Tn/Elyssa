import { createSlice } from "@reduxjs/toolkit";
import electionServices from "../services/electionServices";

const mapSlice = createSlice({
  name: "maps",
  initialState: { counter: 0, maps: [] },
  reducers: {
    createMap(state, action) {
      const ID = state.counter;
      const newMap = { [ID]: action.payload };

      return { counter: ID + 1, maps: [...state.maps, newMap] };
    },
  },
});

export const { createMap } = mapSlice.actions;

export const fetchMapData = (map) => {
  return async (dispatch) => {
    const result = await electionServices.getRequestResults(map);
    dispatch(createMap([map, result]));
  };
};

export default mapSlice.reducer;
