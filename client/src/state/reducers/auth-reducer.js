import {
  LOGIN,
  LOGOUT,
  EMAIL,
  PASSWORD,
  SET_USER,
  SIGNUP,
  VERIFY,
  RESEND,
} from "../types";

const initialState = {
  email: "",
  password: "",
  cognitoUser: null,
  error: "",
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
      error: payload.message,
      email: state.email,
    };
  case `${LOGOUT}_FULFILLED`:
  case `${VERIFY}_FULFILLED`:
  case `${RESEND}_FULFILLED`:
    return {
      ...initialState,
      email: state.email,
    };
  case `${VERIFY}_REJECTED`:
  case `${RESEND}_REJECTED`:
  case `${LOGOUT}_REJECTED`:
    return {
      ...state,
      error: payload.message,
    };
  case EMAIL:
    return {
      ...state,
      email: payload,
    };
  case PASSWORD:
    return {
      ...state,
      password: payload,
    };
  default:
    return state;
  }
}
