import AWS, { DynamoDB } from "aws-sdk"

const { AWS_REGION = "eu-west-1" } = process.env;
AWS.config.update({ region: AWS_REGION });

const allowedDbMethods = [
  "batchGet", "batchWrite",
  "delete", "get",
  "put", "update",
  "scan", "query",
];

export const success = buildResponse.bind(null, 200);
export const failure = buildResponse.bind(null, 500);

export function callDb(action, params) {
  if (!allowedDbMethods.includes(action)) {
    throw new Error(`Action ${action} is not an allowed DB operation.`);
  }

  const client = new DynamoDB.DocumentClient();

  return client[action](params).promise();
}

export function buildResponse(statusCode, body, headers={}) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
}

// a very crude function to construct the UpdateExpression
// for the ddb.update operation - this would (probably) only work
// (barely) for this specific use-case
export function makeUpdateExpression(obj) {
  const toSet = [];
  const toRemove = [];
  let UpdateExpression = "";
  const ExpressionAttributeValues = {};

  for (const [k, v] of Object.entries(obj)) {
    if (!v) {
      toRemove.push(k);
      continue;
    }

    toSet.push(k);
    ExpressionAttributeValues[`:${k}`] = v;
  }

  const sets = toSet.reduce((acc, curr, idx, arr) => {
    if (idx === (arr.length - 1)) {
      return `${acc} ${curr} = :${curr} `;
    }

    return `${acc} ${curr} = :${curr},`;
  }, "SET");

  const removes = toRemove.reduce((acc, curr, idx, arr) => {
    if (idx === (arr.length - 1)) {
      return `${acc} ${curr}`;
    }

    return `${acc} ${curr},`;
  }, "REMOVE");

  if (toSet.length) UpdateExpression += sets;
  if (toRemove.length) UpdateExpression += removes;

  return { UpdateExpression, ExpressionAttributeValues };
}