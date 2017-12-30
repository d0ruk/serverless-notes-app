An implementation of the [Serverless Stack](http://serverless-stack.com) example app. (2/3 complete)

### Usage

Backend

  1. ```npm install```
  2. ```sls deploy``` (alternatively, ```sls deploy -r us-west-2 -s canary```)
  3. Create a cognito user as shown [here](https://serverless-stack.com/chapters/test-the-apis.html). The ```apig-test.js``` module is a helper for that.

Frontend (/client)

1. npm install
2. npm start

### Offline

* Backend
  * ```sls invoke local -f create --path event.json```
  * ```sls invoke local -f list --path event.json```