import React from "react";
import { Route, Redirect } from "react-router-dom";
import { shape, string, object, bool } from "prop-types";

const AuthRoute = ({ component: C, location, ...rest }, { loggedIn }) => ( // eslint-disable-line
  <Route
    {...rest}
    render={props => (
      loggedIn ? (
        <C {...props} />
      ) : (
        <Redirect to={{
          pathname: "/login",
          // TODO: implement redirect after Login
          state: { from: location },
        }}
        />
      )
    )}
  />
);

AuthRoute.contextTypes = {
  loggedIn: bool.isRequired, // eslint-disable-line
};

AuthRoute.propTypes = {
  location: shape({
    pathname: string.isRequired,
    search: string.isRequired,
    hash: string.isRequired,
    state: object,
  }).isRequired,
};

export default AuthRoute;
