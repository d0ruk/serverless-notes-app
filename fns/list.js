import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

export default async function main(evt, ctx, cb) {
  const params = {
    TableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": evt.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await callDb("query", params);
    cb(null, success(result.Items));
  } catch(err) {
    cb(null, failure({ error: err.message }));
  }
}
