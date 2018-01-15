import {
  SET_CONTENT,
  PUT_FILE,
  GET_FILE,
  CREATE_NOTE,
  GET_NOTES,
  DELETE_NOTE,
  GET_NOTE,
  // UPDATE_NOTE,
} from "../types";

const initialState = {
  all: [],
  content: "",
  error: {
    msg: "",
    timestamp: null,
  },
};

export default function notesReducer(state = initialState, { type, payload }) {
  switch (type) {
  case SET_CONTENT:
    return {
      ...state,
      content: payload,
    };
  case `${PUT_FILE}_REJECTED`:
  case `${GET_FILE}_REJECTED`:
  case `${CREATE_NOTE}_REJECTED`:
  case `${GET_NOTES}_REJECTED`:
  case `${GET_NOTE}_REJECTED`:
  case `${DELETE_NOTE}_REJECTED`:
    return {
      ...state,
      error: {
        msg: payload.message,
        timestamp: Date.now(),
      },
    };
  case `${CREATE_NOTE}_FULFILLED`:
    return {
      ...initialState,
      all: [...state.all, payload],
    };
  case `${GET_NOTES}_FULFILLED`:
    return {
      ...state,
      all: payload,
    };
  case `${DELETE_NOTE}_FULFILLED`:
    return {
      ...state,
      all: [...state.all.filter(note => note.noteId !== payload.noteId)],
      error: initialState.error,
    };
  default:
    return state;
  }
}
