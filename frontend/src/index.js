import React from "react";  
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";   
import App from "App";
import "react-toastify/dist/ReactToastify.css";
import "style.css";

// React Context Provider
import { SoftUIControllerProvider } from "context";
import { ContextProvider } from "context/ContextProvider";
import store from "./reducers/store";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <ContextProvider>
      <Provider store={store}>
        <App />
      </Provider>
      </ContextProvider>
    </SoftUIControllerProvider>
  </BrowserRouter>
);
