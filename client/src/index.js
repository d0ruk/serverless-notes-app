import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter as Router } from "react-router-dom"
import Amplify from "aws-amplify"

import App from "./App"
import StackOutput from "../../output.json"

Amplify.configure({
  Auth: {
    identityPoolId: StackOutput.IdentityPool,
    region: StackOutput.Region,
    userPoolId: StackOutput.UserPool,
    userPoolWebClientId: StackOutput.UserPoolClient,
  }
});

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();

if (module.hot && process.env.NODE_ENV !== "production") {
  module.hot.accept();
}
