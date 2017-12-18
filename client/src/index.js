import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider } from "react-redux"
import Amplify from "aws-amplify"

import StackOutput from "../../output.json"
import App from "./App"
import createStore from "./state"

Amplify.configure({
  Auth: {
    identityPoolId: StackOutput.IdentityPool,
    region: StackOutput.Region,
    userPoolId: StackOutput.UserPool,
    userPoolWebClientId: StackOutput.UserPoolClient,
  }
});

let store = createStore();

const render = (Component, props={}) => ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Component {...props} />
    </Router>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
render(App);

if (module.hot && process.env.NODE_ENV !== "production") {
  module.hot.accept("./App", () => {
    const NewApp = require("./App").default;
		render(NewApp);
  });
}
