import middy from "middy"
import { cors } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

const handler = middy(getNote).use(cors());

export default handler;

async function getNote(evt, ctx) {
  const params = {
    TableName,
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: evt.pathParameters.id
    }
  };

  try {
    const result = await callDb("get", params);

    if (result.Item) {
      return success(result.Item);
    } else {
      return failure({ error: "No such note." });
    }
  } catch (err) {
    return failure({ error: err.message });
  }
}
