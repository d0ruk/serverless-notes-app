import { Auth } from "aws-amplify";

export const getCurrentUser = async () => { // eslint-disable-line
  try {
    const user = await Auth.currentAuthenticatedUser();
    const session = await Auth.userSession(user);

    if (session.isValid()) {
      return user;
    }

    return false;
  } catch (err) {
    return false;
  }
};

export const getUserToken = async cognitoUser => {
  try {
    const session = await Auth.userSession(cognitoUser);

    if (session.isValid()) {
      return session.getIdToken().getJwtToken();
    }

    return false;
  } catch (err) {
    return false;
  }
};
