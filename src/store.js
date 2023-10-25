import { configureStore } from "@reduxjs/toolkit";

import electionReducer from "./reducers/electionReducer";
import mapReducer from "./reducers/mapReducer";
import interfaceReducer from "./reducers/interfaceReducer";

const store = configureStore({
  reducer: {
    elections: electionReducer,
    maps: mapReducer,
    interface: interfaceReducer,
  },
});

export default store;
