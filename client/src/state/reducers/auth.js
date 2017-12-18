import * as types from "../types"

const initialState = {
  email: "",
  password: "",
  cognitoUser: null
}

export default function authReducer(state=initialState, { type, payload }) {
  switch(type) {
    case `${types.LOGIN}_PENDING`:
      return {
        ...state
      }
    case `${types.LOGIN}_FULFILLED`:
      return {
        ...state,
        cognitoUser: payload
      }
    case `${types.LOGIN}_REJECTED`:
      return {
        ...state,
        cognitoUser: null
      }
    case types.EMAIL:
      return {
        ...state,
        email: payload
      }
    case types.PASSWORD:
      return {
        ...state,
        password: payload
      }
    default:
      return state;
  }
}
