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
  type: types.SET_EMAIL,
  payload: email,
});

export const setPassword = pwd => ({
  type: types.SET_PASSWORD,
  payload: pwd,
});

// TODO: action not needed - repurpose loginUser()
export const setValidUser = cognitoUser => ({
  type: types.SET_USER,
  payload: cognitoUser,
});

export const signupUser = (derivedUsername, password, email) => ({
  type: types.SIGNUP,
  meta: {
    dontCatch: true,
  },
  payload: Auth.signUp(derivedUsername, password, email),
});

export const resendSignUp = derivedUsername => ({
  type: types.RESEND,
  payload: Auth.resendSignUp(derivedUsername),
});

export const confirmSignUp = (derivedUsername, code) => ({
  type: types.VERIFY,
  meta: {
    dontCatch: true,
  },
  payload: Auth.confirmSignUp(derivedUsername, code),
});
