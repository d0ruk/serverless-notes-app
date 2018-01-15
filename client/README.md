#### React/Redux/Router app with ```antd``` UI components. Manages AWS interactions via ```aws-amplify```.

App detects a logged-in user through an ```auth.cognitoUser``` key in the auth-reducer. This is passed down to child components via ```<App />```'s context. For example, the AuthRoute component relies on this contextual state to restrict access.

As such, app state should be set to a truthy value (a valid cognitoUser object) *only* when a user successfully logs in. (```case ${LOGIN}_FULFILLED ```)

By using the ```aws-amplify``` lib;
* API module by default [signs](https://github.com/aws/aws-amplify/blob/master/packages/aws-amplify/src/API/RestClient.ts#L163) the requests so we don't need to manage sig4 signing.

* Storage module returns a [pre-signed URL](https://github.com/aws/aws-amplify/blob/master/packages/aws-amplify/src/Storage/Storage.ts#L116) of the file in the S3 bucket. It adds Authorization with your *current* token, and expiry.

Modifications after ```npm run eject```;

* Add the path to output.json to ModuleScopePlugin to allow its importing into client/

* postcss-nested and postcss-import-url plugins

* less-loader for antd style files

* BundleAnalyzerPlugin in production config