import { createStore, applyMiddleware, compose } from "redux"
import promiseMiddleware from "redux-promise-middleware"
import rootReducer from "./reducers"

const middleware = [promiseMiddleware()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (initialState = {}) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  if (module.hot && process.env.NODE_ENV !== "production") {
    module.hot.accept("./reducers", () => {
      const newReducer = require("./reducers").default;

      store.replaceReducer(newReducer);
    });
  }

  return store;
}
