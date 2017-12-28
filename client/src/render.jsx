import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import createStore from "./state";

const { persistor, store } = createStore();

export default (Component, props = {}) => {
  render(
    <Provider store={store}>
      <PersistGate
        // loading={<Loading />}
        // onBeforeLift={onBeforeLift}
        persistor={persistor}
      >
        <Router>
          <Component {...props} />
        </Router>
      </PersistGate>
    </Provider>,
    document.getElementById("root"),
  );
};
