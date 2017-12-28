import { createStore, applyMiddleware, compose } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";

import reducers from "./reducers";
import errorMiddleware from "./errorMiddleware";

const middleware = [errorMiddleware, promiseMiddleware()];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const persistConfig = {
  key: "root",
  blacklist: ["auth"],
  storage,
  debug: process.env.NODE_ENV !== "production",
};

export default (initialState = {}) => {
  const rootReducer = persistCombineReducers(persistConfig, reducers);

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  );
  const persistor = persistStore(store);

  if (process.env.NODE_ENV !== "production") {
    // persistor.purge();

    /* eslint-disable */
    if (module.hot) {
      module.hot.accept("./reducers", () => {
        const reducers = require("./reducers").default;
    
        store.replaceReducer(persistCombineReducers(persistConfig, reducers));
      });
    }
  }

  return { persistor, store };
}