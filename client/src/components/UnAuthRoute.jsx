/* eslint react/prop-types: 1 */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func, bool } from "prop-types";
import { parse } from "query-string";

const UnAuthRoute = ({ component: C, ...rest }, { loggedIn }) => {
  const { redirect } = parse(window.location.search);

  return (
    <Route
      {...rest}
      render={props => (
        !loggedIn ? (
          <C {...props} />
        ) : (
          <Redirect to={(redirect && redirect !== "") ? redirect : "/"} />
        )
      )}
    />
  );
};


UnAuthRoute.contextTypes = {
  loggedIn: bool.isRequired,
};

UnAuthRoute.propTypes = {
  component: func.isRequired,
};

export default UnAuthRoute;
