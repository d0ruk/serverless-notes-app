import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

export default async function main(evt, ctx, cb) {
  let data;
  try {
    data = JSON.parse(evt.body)
  } catch(err) {
    return cb(null, failure({ error: err.message }));
  }

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
    cb(null, success(result));
  } catch(err) {
    cb(null, failure({ error: err.message }));
  }
}
