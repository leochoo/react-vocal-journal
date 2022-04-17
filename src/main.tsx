import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{ fontFamily: "Open Sans", primaryColor: "orange" }}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
