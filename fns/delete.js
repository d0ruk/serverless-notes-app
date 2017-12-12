import { success, failure, callDb } from "../util.js"

const TableName = process.env.TABLE_NAME;

export default async function main(evt, ctx, cb) {
  const params = {
    TableName,
    Key: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: evt.pathParameters.id
    }
  };

  try {
    const result = await callDb("delete", params);
    cb(null, success(result));
  } catch(err) {
    cb(null, failure({ error: err.message }));
  }
}
