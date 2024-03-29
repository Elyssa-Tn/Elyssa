// interfaceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  levels: ["gouvernorat", "delegation"],
  level: "gouvernorat",
  viewport: {
    latitude: 33.9989,
    longitude: 10.1658,
    zoom: 5,
    minZoom: 5,
    bearing: 0,
    minBearing: 0,
    maxBearing: 0,
    pitch: 0,
    maxPitch: 0,
  },
  hover: null,
  tooltip: null,
  target: null,
  currentTarget: null,
  minMax: null,
  classNumber: 5,
  compareToggle: false,
  zoomLevel: 6,
  bounds: null,
  levelLock: { 1: false, 2: false },
  chartMode: { 1: false, 2: false },
  tableMode: { 1: false, 2: false },
  ready: false,
  modalOpen: true,
  modalCompareFlag: false,
};

const interfaceSlice = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setViewport: (state, action) => {
      const newViewport = action.payload;
      state.viewport = { ...state.viewport, ...newViewport };
    },
    resetViewport: (state) => {
      state.viewport = initialState.viewport;
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
    setCurrentTarget: (state, action) => {
      state.currentTarget = action.payload;
    },
    toggleCompare: (state, action) => {
      state.compareToggle = action.payload;
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
    setChartMode: (state, action) => {
      const id = action.payload;
      const updatedChartMode = {
        ...state.chartMode,
        [id]: !state.chartMode[id],
      };
      state.chartMode = updatedChartMode;
    },
    setTableMode: (state, action) => {
      const id = action.payload;
      const updatedTableMode = {
        ...state.tableMode,
        [id]: !state.tableMode[id],
      };
      state.tableMode = updatedTableMode;
    },
    setReady: (state, action) => {
      state.ready = action.payload;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setModalCompareFlag: (state, action) => {
      state.modalCompareFlag = action.payload;
    },
  },
});

export const {
  setLevel,
  setViewport,
  resetViewport,
  setHover,
  setTooltip,
  setClickedTarget,
  setCurrentTarget,
  toggleCompare,
  setMinMax,
  setClassNumber,
  setZoomLevel,
  setBounds,
  setLevelLock,
  setChartMode,
  setTableMode,
  setReady,
  setModalOpen,
  setModalCompareFlag,
} = interfaceSlice.actions;

export default interfaceSlice.reducer;
