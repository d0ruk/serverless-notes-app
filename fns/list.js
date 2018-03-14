import middy from "middy"
import { cors } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

const handler = middy(listNotes).use(cors());

export default handler;

async function listNotes(evt, ctx, cb) {
  const params = {
    TableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": evt.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await callDb("query", params);
    return success(result.Items);
  } catch(err) {
    return failure({ error: err.message });
  }
}
