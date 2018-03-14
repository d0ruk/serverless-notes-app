import uuid from "uuid"
import middy from "middy"
import { cors, jsonBodyParser, httpHeaderNormalizer } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

const handler = middy(createNote)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(cors());

export default handler;

async function createNote(evt, ctx) {
  const params = {
    TableName,
    Item: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      createdAt: new Date().getTime(),
      ...evt.body
    }
  }

  try {
    await callDb("put", params);
    return success(params.Item);
  } catch(err) {
    return failure({ error: err.message });
  }
}
