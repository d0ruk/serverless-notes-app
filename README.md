An implementation of the [Serverless Stack](http://serverless-stack.com) example app. (2/3 complete)

### Usage

Backend

  1. ```npm install```
  2. ```sls deploy``` (alternatively, ```sls deploy -r us-west-2 -s canary```)
  3. Create a cognito user as shown [here](https://serverless-stack.com/chapters/test-the-apis.html). The ```apig-test.js``` module is a helper for that.

Frontend (CRA app in /client)

1. npm install
2. npm start

### Offline

Backend
  * ```sls invoke local -f create --path event.json```
  * ```sls invoke local -f list --path event.json```

### Notes

* Every time a different stage (i.e. -s canary) is deployed, the ```output.json``` is **overwritten** with the latest resources details. Be mindful of what resources the client app is using.  Either use the AWS console or do ```sls remove -s somestage``` to clean stale deployments.
