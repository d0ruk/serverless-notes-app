import middy from "middy"
import { cors, jsonBodyParser, httpHeaderNormalizer } from "middy/middlewares"
import { success, failure, callDb, makeUpdateExpression } from "../util.js"
import logger from "lambda-log"

const { TableName } = process.env;

export default middy(updateNote)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(cors());

async function updateNote(evt, ctx) {
  const noteId = evt.pathParameters.id;
  const body = evt.body;
  const updateExpression = makeUpdateExpression(body);
  const updateParams = {
    TableName,
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId,
    },
    ...updateExpression,
    ReturnValues: "ALL_NEW",
  };

  logger.info(`Updating note ${noteId}`, { body, updateExpression });
  try {
    const result = await callDb("update", updateParams);
    return success(result);
  } catch(err) {
    logger.error("Error @ db.update", { err/*, env: process.env*/ });
    return failure({ error: err.message });
  }
}
