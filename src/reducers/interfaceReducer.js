// interfaceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  levels: ["gouvernorat", "delegation"],
  level: "gouvernorat",
  hover: null,
  tooltip: null,
  target: null,
  minMax: null,
  classNumber: 5,
  compareToggle: false,
  zoomLevel: 6,
  bounds: null,
  levelLock: { 1: false, 2: false },
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
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    setBounds: (state, action) => {
      state.bounds = action.payload;
    },
    setLevelLock: (state, action) => {
      const id = action.payload;
      const updatedLevelLock = {
        ...state.levelLock,
        [id]: !state.levelLock[id],
      };
      state.levelLock = updatedLevelLock;
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
  setZoomLevel,
  setBounds,
  setLevelLock,
} = interfaceSlice.actions;

export default interfaceSlice.reducer;
