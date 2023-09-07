import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store.js";
// import { StyledEngineProvider } from "@mui/material";
import { StyledEngineProvider } from "@mui/joy";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <React.StrictMode>
        <StyledEngineProvider>
          <App />
        </StyledEngineProvider>
      </React.StrictMode>
    </Router>
  </Provider>
);
