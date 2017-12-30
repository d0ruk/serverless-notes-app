/* eslint function-paren-newline: 0 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

@connect(
  state => ({ user: state.auth.cognitoUser }),
)
export default class Home extends Component {
  render() {
    const { user } = this.props; // eslint-disable-line

    return (
      <Fragment>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <h1>Welcome <b>{user.username}</b></h1>
      </Fragment>
    );
  }
}
