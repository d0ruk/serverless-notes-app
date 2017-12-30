import {
  LOGIN,
  LOGOUT,
  EMAIL,
  PASSWORD,
  SET_USER,
} from "../types";

const initialState = {
  email: "",
  password: "",
  cognitoUser: null,
  error: "",
};

export default function authReducer(state = initialState, { type, payload }) {
  switch (type) {
  case `${LOGIN}_PENDING`:
    return {
      ...state,
    };
  case `${LOGIN}_FULFILLED`:
    return {
      ...state,
      cognitoUser: payload,
    };
  case `${LOGIN}_REJECTED`:
    return {
      ...initialState,
      error: payload.message,
      email: state.email,
    };
  case `${LOGOUT}_FULFILLED`:
    return {
      ...initialState,
      email: state.email,
    };
  case `${LOGOUT}_REJECTED`:
    return {
      ...initialState,
      error: payload.message,
      email: state.email,
    };
  case SET_USER:
    return {
      ...state,
      cognitoUser: payload,
    };
  case EMAIL:
    return { ...state, email: payload };
  case PASSWORD:
    return { ...state, password: payload };
  default:
    return state;
  }
}
