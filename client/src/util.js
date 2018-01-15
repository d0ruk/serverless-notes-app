import { Auth } from "aws-amplify";

const isProd = process.env.NODE_ENV === "production";

export const getCurrentUser = async () => {
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
    console.log("%cFailed to extract user token", "color:red;font-weight:bold;font-size:2rem"); // eslint-disable-line
    !isProd && console.dir(err); // eslint-disable-line
    return false;
  }
};

// https://forums.aws.amazon.com/thread.jspa?threadID=259349&tstart=0
export const makeUsername = email => {
  const REGEX = /(\S+)@(\S+)\.(\S+)/;

  if (!REGEX.test(email)) return false;

  const deStructuredEmailPattern = email.match(REGEX);

  return (
    deStructuredEmailPattern[1] + "_" + // eslint-disable-line
    deStructuredEmailPattern[2] + "_" +
    deStructuredEmailPattern[3]
  );
};

export const downloadFromUrl = url => {
  const a = document.createElement("a");
  a.style.display = "none";
  // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
  a.rel = "noopener noreferrer";
  a.target = "_blank";
  a.href = url;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
