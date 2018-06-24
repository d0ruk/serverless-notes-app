import React from "react";
import { Route, Redirect } from "react-router-dom";
import { func, object } from "prop-types";
import { parse } from "querystring";

const UnAuthRoute = ({ component: C, ...rest }, { cognitoUser }) => {
  const { redirect } = parse(window.location.search.slice(1));

  return (
    <Route
      {...rest}
      render={props => (
        !cognitoUser ? (
          <C {...props} />
        ) : (
          <Redirect to={(redirect && redirect !== "") ? redirect : "/"} />
        )
      )}
    />
  );
};


UnAuthRoute.contextTypes = {
  cognitoUser: object,
};

UnAuthRoute.propTypes = {
  component: func.isRequired,
};

export default UnAuthRoute;
