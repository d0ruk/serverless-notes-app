import { createStore, applyMiddleware, compose } from "redux";
import promiseMiddleware from "redux-promise-middleware";

import rootReducer from "./reducers";
import errorMiddleware from "./errorMiddleware";

const middleware = [errorMiddleware, promiseMiddleware()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line

export default (initialState = {}) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

  /* eslint-disable */
  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./reducers", () => {
        const newReducer = require("./reducers").default;

        store.replaceReducer(newReducer);
      });
    }
  }

  return store;
}