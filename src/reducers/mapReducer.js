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
    deleteMap(state, action) {
      const filteredMaps = Object.keys(state.maps)
        .filter((id) => id !== action.payload)
        .reduce((result, id) => {
          result[id] = { ...state.maps[id] };
          return result;
        }, {});
      return { ...state, maps: [...filteredMaps] };
    },
  },
});

export const { createMap, deleteMap } = mapSlice.actions;

export const fetchMapData = (map) => {
  return async (dispatch) => {
    const result = await electionServices.getRequestResults(map);
    dispatch(createMap([map, result]));
  };
};

export default mapSlice.reducer;
