import { combineReducers } from "redux";

import auth from "./auth-reducer";
import notes from "./notes-reducer";

export default combineReducers({
  auth,
  notes,
});
