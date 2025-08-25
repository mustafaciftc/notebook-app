import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import React from "react";
import App from "./App";
import store from "./src/store/store";

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent("mobile", () => RootApp);
