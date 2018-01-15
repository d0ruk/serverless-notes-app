import { API, Storage } from "aws-amplify";
import * as types from "../types";

export const setContent = content => ({
  type: types.SET_CONTENT,
  payload: content,
});

export const putFile = File => ({
  type: types.PUT_FILE,
  payload: Storage.put(File.name, File, {
    contentType: File.type || "binary/octet-stream",
  }),
});

export const getFile = key => ({
  type: types.GET_FILE,
  payload: Storage.get(key),
});

export const createNote = note => ({
  type: types.CREATE_NOTE,
  payload: API.post("notes", "/notes", { body: note }),
  meta: {
    dontCatch: true,
  },
});

export const deleteNote = noteId => ({
  type: types.DELETE_NOTE,
  payload: async () => {
    try {
      await API.del("notes", `/notes/${noteId}`);
      return Promise.resolve({ noteId });
    } catch (err) {
      return Promise.reject(err);
    }
  },
});

export const updateNote = noteId => ({
  type: types.UPDATE_NOTE,
  payload: API.put("notes", `/notes/${noteId}`),
});

export const getNote = noteId => ({
  type: types.GET_NOTE,
  payload: API.get("notes", `/notes/${noteId}`),
});

export const getNotes = () => ({
  type: types.GET_NOTES,
  payload: API.get("notes", "/notes"),
});
