import { createSlice } from "@reduxjs/toolkit";
import electionServices from "../services/electionServices";

const electionSlice = createSlice({
  name: "elections",
  initialState: {},
  reducers: {
    electionInit(state, action) {
      const object = action.payload.data;
      return { ...state, init: object };
    },
    addElectionDataToState(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { electionInit, addElectionDataToState } = electionSlice.actions;

export const initializeElections = () => {
  return async (dispatch) => {
    const elections = await electionServices.init();
    dispatch(electionInit(elections));
  };
};

export const fetchElectionData = (election) => {
  return async (dispatch) => {
    const electionData = await electionServices.getElectionInfo(election);
    const object = { [election]: electionData };
    dispatch(addElectionDataToState(object));
  };
};

export default electionSlice.reducer;
