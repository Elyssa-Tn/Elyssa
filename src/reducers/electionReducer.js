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

    const sortedElections = [...elections.data.elections].sort((a, b) => {
      const year1 = parseInt(a.nom.match(/\d{4}/)[0], 10);
      const year2 = parseInt(b.nom.match(/\d{4}/)[0], 10);

      return year1 - year2;
    });

    dispatch(
      electionInit({
        ...elections,
        data: { ...elections.data, elections: sortedElections },
      })
    );
  };
};

export const fetchElectionData = (election) => {
  return async (dispatch) => {
    dispatch(toggleLoading());
    const electionData = await electionServices.getElectionInfo(election);

    if (electionData.data) {
      if (electionData.data.partis && electionData.data.partis.length !== 0) {
        const { data } = await electionServices.getPartiScores(election);

        const partiScores = data.result[0].variables[0].resultat;

        electionData.data.partis.forEach((parti) => {
          const partiScore = partiScores.find(
            (partiScore) => partiScore.code_parti === parti.code_parti
          );
          if (partiScore) {
            parti.prc = Number(partiScore.prc.toFixed(1));
            parti.voix = Number(partiScore.voix.toFixed(1));
            parti.votes = Number(partiScore.votes.toFixed(1));
          }
        });

        const sortedPartis = [...electionData.data.partis].sort(
          (a, b) => (b.prc || 0) - (a.prc || 0)
        );

        electionData.data = { ...electionData.data, partis: sortedPartis };
      }
      dispatch(addElectionDataToState({ [election]: electionData.data }));
    }

    dispatch(toggleLoading());
  };
};

export default electionSlice.reducer;
