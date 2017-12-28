/* eslint function-paren-newline: 0 */
import React, { Component } from "react";
import { connect } from "react-redux";

@connect(
  state => ({ user: state.auth.cognitoUser }),
)
export default class Home extends Component {
  render() {
    const { user } = this.props; // eslint-disable-line

    return (
      <h1>Welcome <b>{user.username}</b></h1>
    );
  }
}
