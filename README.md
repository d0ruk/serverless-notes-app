An implementation of the [Serverless Stack](http://serverless-stack.com) example app.

### Usage
  1. Clone the repo
  2. ```npm install```
  3. ```sls deploy``` (alternatively, ```sls deploy -r us-west-2 -s canary```)

* ```sls invoke local -f create --path event.json```
* ```sls invoke local -f list --path event.json```

#### TODO
  * remove magic strings from .yml (via .env?)
  * separate event.json for each function
  * describe stack region in an env variable?
