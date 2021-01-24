[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fd0ruk%2Fserverless-notes-app.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fd0ruk%2Fserverless-notes-app?ref=badge_shield)

An implementation of the [Serverless Stack](http://serverless-stack.com) demo app.

Required;

* [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration)
* ```npm install -g serverless```

## Usage

#### Backend

```sh
  > yarn
  > sls deploy # alternatively, sls deploy -r us-west-2 -s canary
```
  To test the Cognito/API Gateway integration, create a cognito user as shown [here](https://serverless-stack.com/chapters/test-the-apis.html), and run ```apig-test.js``` with the details of the created user. (edit ```userDetails```)

#### Frontend (client/)

```sh
> yarn
> yarn start
```

#### Offline

  * ```sls invoke local -f create --path event.json```
  * ```sls invoke local -f list --path event.json```
  * ```sls deploy function -f delete```

---

### Notes

* Every time a different stage (i.e. -s canary) is deployed, the ```output.json``` is **overwritten** with the latest stack output. Be mindful of what resources the client app is using.  Either use the AWS console or do ```sls remove -s somestage``` to clean stale deployments.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fd0ruk%2Fserverless-notes-app.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fd0ruk%2Fserverless-notes-app?ref=badge_large)