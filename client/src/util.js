import { Auth } from "aws-amplify";
import randSentence from "random-sentence";
import random from "lodash/random";
import { number, string, shape } from "prop-types";

const isProd = process.env.NODE_ENV === "production";

export const MAX_ATTACHMENT_SIZE = 10000000;
export const noteShape = shape({
  noteId: string.isRequired,
  content: string.isRequired,
  attachment: string,
  color: string,
  userId: string.isRequired,
  createdAt: number.isRequired,
});

export const noteColors = [{
  name: "azure",
  hex: "#f0ffff",
  rgb: "rgb(240,255,255)",
}, {
  name: "misty rose",
  hex: "#ffe4e1",
  rgb: "rgb(255,228,225)",
}, {
  name: "honeydew",
  hex: "#f0fff0",
  rgb: "rgb(240,255,240)",
}, {
  name: "bisque",
  hex: "#ffe4c4",
  rgb: "rgb(255,228,196)",
}];

export const makeRandomNote = () => {
  const note = {
    content: randSentence({ min: 4, max: 42 }),
  };
  const randomColor = noteColors[random(4)];

  if (randomColor) {
    note.color = randomColor.rgb;
  }

  return note;
};

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

export const isEmail = str => /(\S+)@(\S+)\.(\S+)/.test(str);

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

export const delay = (
  dt = 700,
  { reject = false, reason = "INTERNAL" } = {}
) => (
  new Promise((res, rej) => {
    setTimeout(reject ? rej.bind(null, reason) : res.bind(null, reason), dt);
  })
);
