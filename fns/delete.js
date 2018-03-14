import middy from "middy"
import { cors } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

const handler = middy(deleteNote).use(cors());

export default handler;

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
    return failure({ error: err.message });
  }
}
