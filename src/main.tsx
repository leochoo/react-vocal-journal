import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider
        theme={{ fontFamily: "Open Sans", primaryColor: "orange" }}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
