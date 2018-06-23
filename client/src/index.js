// TODO: import { ServiceWorker } from 'aws-amplify';
import Amplify from "aws-amplify";

import "./index.css";
import StackOutput from "../../output.json";
import render from "./render";
import App from "./App";

const isProd = process.env.NODE_ENV === "production";
if (!isProd) window.stackOutput = StackOutput;

Amplify.configure({
  Auth: {
    // mandatorySignIn: true,
    identityPoolId: StackOutput.IdentityPool,
    region: StackOutput.Region,
    userPoolId: StackOutput.UserPool,
    userPoolWebClientId: StackOutput.UserPoolClient,
  },
  Storage: {
    bucket: StackOutput.AttachmentsBucket,
    region: StackOutput.Region,
    identityPoolId: StackOutput.IdentityPool,
    // track: true,
    level: "private",
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: StackOutput.ServiceEndpoint,
        region: StackOutput.Region,
      },
    ]
  }
});

render(App);

/* eslint-disable */
if (module.hot) {
  module.hot.accept("./App.jsx", () => {
    const NewApp = require("./App.jsx").default;
    render(NewApp);
  });
}
