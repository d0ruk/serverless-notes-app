import middy from "middy"
import { cors } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"
import logger from "lambda-log"

const { TableName } = process.env;

export default middy(deleteNote).use(cors());

async function deleteNote(evt, ctx, cb) {
  const params = {
    TableName,
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: evt.pathParameters.id
    }
  };

  try {
    const result = await callDb("delete", params);
    return success(result);
  } catch(err) {
    logger.error("Error @ db.delete", { err, env: process.env });
    return failure({ error: err.message });
  }
}
