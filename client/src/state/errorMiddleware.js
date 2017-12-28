// redux-promise-middleware doesn't catch the async errors thrown within
export default store => next => action => { // eslint-disable-line
  if (!isPromise(action.payload)) {
    return next(action);
  }

  return next(action)
    .catch(error => {
      if (process.env.NODE_ENV === "development") {
        console.warn(`${action.type} caught at middleware with reason: ${error.message}.`); // eslint-disable-line
      }

      return error;
    });
};

function isPromise(value) {
  if (value !== null && typeof value === "object") {
    return value && typeof value.then === "function";
  }

  return false;
}
