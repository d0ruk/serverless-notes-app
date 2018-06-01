import middy from "middy"
import { cors } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"
import logger from "lambda-log"

const { TableName } = process.env;

export default middy(listNotes).use(cors());

async function listNotes(evt, ctx) {
  const userId = evt.requestContext.identity.cognitoIdentityId;
  const params = {
    TableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  logger.info(`Listing notes for ${userId}`);
  try {
    const result = await callDb("query", params);
    return success(result.Items);
  } catch(err) {
    logger.error("Error @ db.query", { err, env: process.env });
    return failure({ error: err.message });
  }
}
