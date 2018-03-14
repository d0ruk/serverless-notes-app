import AWS, { DynamoDB } from "aws-sdk"

const region = process.env.AWS_REGION || "eu-central-1";
AWS.config.update({ region });

const allowedDbMethods = [
  "batchGet", "batchWrite",
  "delete", "get",
  "put", "update",
  "scan", "query",
];

export const success = (body, code=200) => buildResponse(code, body);
export const failure = (body, code=500) => buildResponse(code, body);

export function callDb(action, params) {
  if (!allowedDbMethods.includes(action)) {
    throw new Error(`Action ${action} is not an allowed DB operation.`);
  }

  const client = new DynamoDB.DocumentClient();

  return client[action](params).promise();
}

function buildResponse(statusCode, body, headers={}) {
  return {
    statusCode,
    headers: {
      ...headers
    },
    body: JSON.stringify(body)
  };
}
