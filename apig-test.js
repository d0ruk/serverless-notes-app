const { spawn } = require("child_process");
const AWS = require("aws-sdk");
const output = require("./output.json");

AWS.config.region = output.Region;
const idp = new AWS.CognitoIdentityServiceProvider({ apiVersion: "2016-04-18" });
const userDetails = {
  USERNAME: "test",
  PASSWORD: "Qwerty12", // "Changed12"
};
const args = [
  "--username", userDetails["USERNAME"],
  "--password", userDetails["PASSWORD"],
  "--user-pool-id", output.UserPool,
  "--app-client-id", output.UserPoolClient,
  "--cognito-region", output.Region,
  "--identity-pool-id", output.IdentityPool,
  "--invoke-url", output.ServiceEndpoint,
  "--api-gateway-region", output.Region,
  "--path-template", "/notes",
  "--method", "POST",
  "--body", "{\"content\":\"hello world\",\"attachment\":\"hello.jpg\"}"
];

spawn("./node_modules/.bin/apig-test", args).stdout.pipe(process.stdout);

// If you get "set a new password" warning, use the below
/*
idp.adminInitiateAuth({
  AuthFlow: "ADMIN_NO_SRP_AUTH",
  ClientId: output.UserPoolClient,
  UserPoolId: output.UserPool,
  AuthParameters: userDetails // Assuming the initial password is Qwerty12
}, cb);

function cb(err, { Session }) {
  if(err) return console.log(err);

  const response = {
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: output.UserPoolClient,
    ChallengeResponses: {
      USERNAME: "test",
      NEW_PASSWORD: "Changed12"
    },
    Session,
  }

  idp.respondToAuthChallenge(response, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
  });
};
*/