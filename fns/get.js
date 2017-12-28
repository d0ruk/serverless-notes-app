import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

export default async function main(evt, ctx, cb) {
  const params = {
    TableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: evt.pathParameters.id
    }
  };

  try {
    const result = await callDb("get", params);

    if (result.Item) {
      cb(null, success(result.Item));
    } else {
      cb(null, failure({ error: "Item not found." }));
    }
  } catch (err) {
    cb(null, failure({ error: err.message }));
  }
}
