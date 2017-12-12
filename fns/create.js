import uuid from "uuid"
import { success, failure, callDb } from "../util.js";

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
    Item: {
      userId: evt.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: new Date().getTime()
    }
  }

  try {
    await callDb("put", params);
    cb(null, success(params.Item));
  } catch(err) {
    cb(null, failure({ error: err.message }));
  }
}
