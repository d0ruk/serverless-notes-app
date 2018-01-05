/* eslint react/prop-types: 1 */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func, object } from "prop-types";

const AuthRoute = ({ component: C, ...rest }, { cognitoUser }) => (
  <Route
    {...rest}
    render={props => (
      cognitoUser ? (
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
  cognitoUser: object,
};

AuthRoute.propTypes = {
  component: func.isRequired,
};

export default AuthRoute;
