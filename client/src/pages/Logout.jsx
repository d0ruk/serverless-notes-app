import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { object, func } from "prop-types";

import { logoutUser } from "../state/actions/auth-actions";

@connect(
  ({ auth: { cognitoUser } }) => ({ cognitoUser }),
  { logoutUser },
)
export default class App extends Component {
  static propTypes = {
    cognitoUser: object, // eslint-disable-line
    logoutUser: func.isRequired,
  };

  componentDidMount = async () => {
    if (this.props.cognitoUser) {
      await this.props.logoutUser();
    }
  }

  render() {
    return this.props.cognitoUser ? null : <Redirect to="/login" />;
  }
}
