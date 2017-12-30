/* eslint react/prop-types: 1 */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func, bool } from "prop-types";

const AuthRoute = ({ component: C, ...rest }, { loggedIn }) => (
  <Route
    {...rest}
    render={props => (
      loggedIn ? (
        <C {...props} />
      ) : (
        <Redirect
          to={`/login?redirect=${props.location.pathname}${props.location.search}`}
        />
      )
    )}
  />
);

AuthRoute.contextTypes = {
  loggedIn: bool.isRequired,
};

AuthRoute.propTypes = {
  component: func.isRequired,
};

export default AuthRoute;
