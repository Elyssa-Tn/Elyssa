import { createSlice } from "@reduxjs/toolkit";
import electionServices from "../services/electionServices";

const electionSlice = createSlice({
  name: "elections",
  initialState: { loading: false, data: {}, init: null },
  reducers: {
    toggleLoading(state) {
      state.loading = !state.loading;
    },
    electionInit(state, action) {
      state.init = action.payload.data;
    },
    addElectionDataToState(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { toggleLoading, electionInit, addElectionDataToState } =
  electionSlice.actions;

export const initializeElections = () => {
  return async (dispatch) => {
    const elections = await electionServices.init();
    dispatch(electionInit(elections));
  };
};

export const fetchElectionData = (election) => {
  return async (dispatch) => {
    dispatch(toggleLoading());
    const electionData = await electionServices.getElectionInfo(election);
    if (electionData.data)
      dispatch(addElectionDataToState({ [election]: electionData.data }));

    //Extra time for reasons
    // setTimeout(() => {
    dispatch(toggleLoading());
    // }, 50);
  };
};

export default electionSlice.reducer;
