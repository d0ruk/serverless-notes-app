import uuid from "uuid"
import middy from "middy"
import { cors, jsonBodyParser, httpHeaderNormalizer } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"
import logger from "lambda-log"

const { TableName } = process.env;

export default middy(createNote)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(cors());

async function createNote(evt, ctx) {
  const userId = evt.requestContext.identity.cognitoIdentityId;
  const noteId = uuid.v1();
  const params = {
    TableName,
    Item: {
      userId,
      noteId,
      createdAt: new Date().getTime(),
      ...evt.body
    }
  }

  logger.info(`Creating note ${noteId} for ${userId}`);
  try {
    await callDb("put", params);
    return success(params.Item);
  } catch(err) {
    logger.error("Error @ db.put", { err, env: process.env });
    return failure({ error: err.message });
  }
}
