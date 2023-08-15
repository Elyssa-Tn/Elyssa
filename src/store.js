import { configureStore } from "@reduxjs/toolkit";

import electionReducer from "./reducers/electionReducer";
import mapReducer from "./reducers/mapReducer";

const store = configureStore({
  reducer: {
    elections: electionReducer,
    maps: mapReducer,
  },
});

export default store;
