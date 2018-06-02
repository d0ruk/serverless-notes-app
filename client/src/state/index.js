import { createStore, applyMiddleware, compose } from "redux";
import promiseMiddleware from "redux-promise-middleware";

import rootReducer from "./reducers";
import errorMiddleware from "./errorMiddleware";

const middleware = [errorMiddleware, promiseMiddleware()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const isProd = process.env.NODE_ENV === "production";

export default (initialState = {}) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

  /* eslint-disable */
  if (module.hot && !isProd) {
    module.hot.accept("./reducers", () => {
      const newReducer = require("./reducers").default;

      store.replaceReducer(newReducer);
    });
  }

  return store;
}
