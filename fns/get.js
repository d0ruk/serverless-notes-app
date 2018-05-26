import middy from "middy"
import { cors } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"
import logger from "lambda-log"

const { TableName } = process.env;

export default middy(getNote).use(cors());

async function getNote(evt, ctx) {
  const noteId = evt.pathParameters.id;
  const params = {
    TableName,
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId
    }
  };

  try {
    const result = await callDb("get", params);

    if (result.Item) {
      return success(result.Item);
    } else {
      const msg = `No such note with id ${noteId}`;
      logger.warn(msg);
      return failure({ error: msg });
    }
  } catch (err) {
    logger.error("Error @ db.get", { err, env: process.env });
    return failure({ error: err.message });
  }
}
