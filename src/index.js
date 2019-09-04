import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./context/AppContext";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./styles/index.scss";

ReactDOM.render(
  <AppProvider>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </AppProvider>,
  document.getElementById(`root`)
);

serviceWorker.unregister(); // http://bit.ly/CRA-PWA