import { Auth } from "aws-amplify";
import * as types from "../types";

export const loginUser = (email, password) => ({
  type: types.LOGIN,
  payload: Auth.signIn(email, password),
});

export const logoutUser = () => ({
  type: types.LOGOUT,
  payload: Auth.signOut(),
});

export const setEmail = email => ({
  type: types.EMAIL,
  payload: email,
});

export const setPassword = pwd => ({
  type: types.PASSWORD,
  payload: pwd,
});
