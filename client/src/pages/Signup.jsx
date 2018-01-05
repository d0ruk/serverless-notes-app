import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { func, string } from "prop-types";
import { Helmet } from "react-helmet";
import { Row, Col, Input, Icon, Button, Tooltip, Tabs } from "antd";
import { history as historyProps } from "react-router-prop-types";

import styles from "./Signup.css";
import {
  setEmail, setPassword,
  signupUser, resendSignUp,
  confirmSignUp, loginUser,
} from "../state/actions/auth-actions";
import { makeUsername } from "../util";

@connect(
  ({ auth: { email, password, error } }) =>
    ({ email, password, error }),
  { signupUser, resendSignUp, setEmail, confirmSignUp, setPassword, loginUser },
)
export default class SignUp extends Component {
  static propTypes = {
    setEmail: func.isRequired,
    setPassword: func.isRequired,
    signupUser: func.isRequired,
    confirmSignUp: func.isRequired,
    loginUser: func.isRequired,
    resendSignUp: func.isRequired,
    email: string,
    password: string,
    error: string,
    history: historyProps,
  }

  state = {
    activeTab: "signup",
    tempUser: null,
  }

  componentDidMount() {
    this.emailField.focus();
  }

  componentWillUpdate() {
    const { verifyField, confirmField } = this;
    if (verifyField) verifyField.input.value = "";
    if (confirmField) confirmField.input.value = "";
  }

  render() {
    const { activeTab } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <Row>
          <Col xs={24} md={12} lg={6} className={styles.column}>
            <Tabs
              activeKey={activeTab}
              onChange={this.handleTabChange}
            >
              <Tabs.TabPane
                tab="Sign Up"
                key="signup"
              >
                {this.renderSignupForm()}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Verify"
                key="verify"
              >
                {this.renderVerifyForm()}
              </Tabs.TabPane>
            </Tabs>
            <Button
              type="primary"
              onClick={this.handleSubmit}
              disabled={!this.isValid()}
              ref={c => { this.button = c; }}
            >
                Done
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }

  handleTabChange = key => {
    this.setState({ activeTab: key });
  }

  renderVerifyForm = () => {
    const { email, error } = this.props;

    return (
      <Row className={styles.verifyForm}>
        {error && <div className="error">{error}</div>}
        <Input.Group>
          <Input
            id="email"
            type="text"
            placeholder="email"
            value={email}
            prefix={<Icon type="user" />}
            ref={c => { this.emailField = c; }}
            onChange={this.handleChange}
            onPressEnter={this.handleSubmit}
          />
          <Input
            type="text"
            placeholder="verify code"
            prefix={<Icon type="check" />}
            ref={c => { this.verifyField = c; }}
            onPressEnter={this.handleSubmit}
          />
        </Input.Group>
        <Tooltip placement="right" title="Resend code">
          <Button
            type="secondary"
            icon="reload"
            onClick={this.handleResend}
            disabled={!makeUsername(email)}
            ref={c => { this.reSendbutton = c; }}
          />
        </Tooltip>
      </Row>
    );
  }

  renderSignupForm = () => {
    const { email, password, error } = this.props;

    return (
      <Row className={styles.signupForm}>
        {error && <div className="error">{error}</div>}
        <Input.Group>
          <Input
            id="email"
            type="text"
            placeholder="email"
            value={email}
            prefix={<Icon type="user" />}
            ref={c => { this.emailField = c; }}
            onChange={this.handleChange}
            onPressEnter={this.handleSubmit}
          />
          <Input
            id="password"
            placeholder="pick a password"
            defaultValue=""
            type="password"
            value={password}
            prefix={<Icon type="lock" />}
            suffix={
              <Tooltip
                placement="right"
                title={() => <span>min. 8 characters<br />at least 1 numeric, 1 caps</span>}
              >
                <Icon type="info-circle-o" />
              </Tooltip>}
            ref={c => { this.passwordField = c; }}
            onChange={this.handleChange}
            onPressEnter={this.handleSubmit}
          />
          <Input
            placeholder="confirm password"
            type="password"
            prefix={<Icon type="lock" />}
            ref={c => { this.confirmField = c; }}
            onPressEnter={this.handleSubmit}
          />
        </Input.Group>
      </Row>
    );
  }

  isValid = () => {
    const { email, password } = this.props;
    const { activeTab } = this.state;
    const validPassword = activeTab === "verify"
      // if verifying, password validity is irrelevant to the UI
      ? true
      : password !== "" && password.length > 7;

    return Boolean(makeUsername(email)) && validPassword;
  }

  handleSubmit = async evt => {
    evt.preventDefault();
    if (!this.isValid()) return;

    const { email, password } = this.props;
    const { activeTab } = this.state;
    // we need a throw-away username for the signup & verify steps
    // user can still login with their email
    const derivedUsername = makeUsername(email);

    switch (activeTab) {
    case "signup": {
      let tempUser;
      const confirmInput = this.confirmField.input;
      const resetField = () => {
        confirmInput.value = "";
        this.props.setPassword("");
        this.passwordField.focus();
      };

      if (confirmInput.value !== password) {
        resetField();
        break;
      }

      this.button.setState({ loading: true });
      try {
        const { value } = await this.props.signupUser(derivedUsername, password, email);
        // an unconfirmed Cognito user
        tempUser = value.user;
      } catch (_) {
        resetField();
        break;
      }

      this.setState({ activeTab: "verify", tempUser });
      break;
    }

    case "verify": {
      const verifyInput = this.verifyField.input;
      const { tempUser } = this.state;
      const resetField = () => {
        verifyInput.value = "";
        this.verifyField.focus();
      };

      if (!/^\d{6}$/.test(verifyInput.value)) {
        resetField();
        break;
      }

      this.button.setState({ loading: true });
      try {
        await this.props.confirmSignUp(derivedUsername, verifyInput.value);

        if (tempUser) {
          // we check only for the existence of the Cognito user
          // if there is a user in state, there is an email & a password
          // we can use. so we log the user in
          await this.props.loginUser(email, password);
        } else {
          // we don't have a Cognito user in state,
          // so we don't have a password to login
          this.props.history.push("/login");
        }
      } catch (_) {
        this.button.setState({ loading: false });
        resetField();
      }
      break;
    }
    default:
      break;
    }
  }

  handleResend = async () => {
    const { email } = this.props;
    // we need the same derived username for resend
    const derivedUsername = makeUsername(email);

    await this.reSendbutton.setState({ loading: true });
    await this.props.resendSignUp(derivedUsername);
    await this.reSendbutton.setState({ loading: false });
  }

  handleChange = evt => {
    const { id: field, value } = evt.target;

    if (field === "email") {
      this.props.setEmail(value);
    } else if (field === "password") {
      this.props.setPassword(value);
    }
  }
}
