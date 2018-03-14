import middy from "middy"
import { cors, jsonBodyParser, httpHeaderNormalizer } from "middy/middlewares"
import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

const handler = middy(updateNote)
  .use(httpHeaderNormalizer())
  .use(jsonBodyParser())
  .use(cors());

export default handler;

async function updateNote(evt, ctx, cb) {
  const data = evt.body;
  const params = {
    TableName,
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: evt.pathParameters.id
    },
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ExpressionAttributeValues: {
      ":attachment": data.attachment ? data.attachment : null,
      ":content": data.content ? data.content : null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await callDb("update", params);
    return success(result);
  } catch(err) {
    return failure({ error: err.message });
  }
}
