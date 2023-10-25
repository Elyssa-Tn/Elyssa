// interfaceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  level: "gouvernorat",
  hover: null,
  tooltip: null,
  target: null,
  minMax: null,
  classNumber: 5,
  compareToggle: false,
};

const interfaceSlice = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setHover: (state, action) => {
      state.hover = action.payload;
    },
    setTooltip: (state, action) => {
      state.tooltip = action.payload;
    },
    setClickedTarget: (state, action) => {
      state.target = action.payload;
    },
    toggleCompare: (state) => {
      state.compareToggle = !state.compareToggle;
    },
    setMinMax: (state, action) => {
      state.minMax = action.payload;
    },
    setClassNumber: (state, action) => {
      state.classNumber = action.payload;
    },
  },
});

export const {
  setLevel,
  setHover,
  setTooltip,
  setClickedTarget,
  toggleCompare,
  setMinMax,
  setClassNumber,
} = interfaceSlice.actions;

export default interfaceSlice.reducer;
