import {
  LOGIN,
  LOGOUT,
  SET_EMAIL,
  SET_PASSWORD,
  SET_USER,
  SIGNUP,
  VERIFY,
  RESEND,
} from "../types";

const initialState = {
  email: "",
  password: "",
  cognitoUser: null,
  error: {
    msg: "",
    timestamp: null,
  },
};

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
  case SET_USER:
  case `${LOGIN}_FULFILLED`:
    return {
      ...initialState,
      email: state.email,
      cognitoUser: payload,
    };
  case `${LOGIN}_REJECTED`:
  case `${SIGNUP}_REJECTED`:
    return {
      ...initialState,
      error: {
        msg: payload.message,
        timestamp: Date.now(),
      },
      email: state.email,
    };
  case `${LOGOUT}_FULFILLED`:
  // case `${VERIFY}_FULFILLED`:
  // case `${RESEND}_FULFILLED`:
    return {
      ...initialState,
      email: state.email,
    };
  case `${VERIFY}_REJECTED`:
  case `${RESEND}_REJECTED`:
  case `${LOGOUT}_REJECTED`:
    return {
      ...state,
      error: {
        msg: payload.message,
        timestamp: Date.now(),
      },
    };
  case SET_EMAIL:
    return {
      ...state,
      email: payload,
    };
  case SET_PASSWORD:
    return {
      ...state,
      password: payload,
    };
  default:
    return state;
  }
}
