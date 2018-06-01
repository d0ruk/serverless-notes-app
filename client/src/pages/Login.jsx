import React, { Component } from "react";
import { Row, Col, Input, Icon, Button, notification, Tabs } from "antd";
import { connect } from "react-redux";
import { func, string, number, shape } from "prop-types";
import { Helmet } from "react-helmet";
import { history as historyProps } from "react-router-prop-types";

import styles from "./Login.css";
import { loginUser, setEmail, setPassword } from "../state/actions/auth-actions";
import { delay, isEmail } from "../util";

@connect(
  ({ auth: { email, password, error } }) => ({ email, password, error }),
  { loginUser, setEmail, setPassword },
)
export default class Login extends Component {
  static propTypes = {
    loginUser: func.isRequired,
    setEmail: func.isRequired,
    setPassword: func.isRequired,
    email: string,
    password: string,
    error: shape({
      msg: string,
      timestamp: number,
    }),
    history: historyProps,
  }

  componentDidMount() {
    this.emailField.focus();
  }

  componentWillUpdate = async nProps => {
    const { error: { msg, timestamp } } = nProps;
    const { error } = this.props;

    if (msg && error.timestamp !== timestamp) {
      notification.error({ message: msg });

      if (/User does not exist/.test(msg)) {
        await delay(1000);
        this.props.history.push("/signup");
      }
    }
  }

  render() {
    const { email, password } = this.props;

    return (
      <Row>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Col xs={24} md={8} xl={4}>
          {/* using Tabs for stylistic consistency */}
          <Tabs activeKey="login">
            <Tabs.TabPane
              tab="Login"
              key="login"
              className={styles.loginForm}
            >
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
                  placeholder="password"
                  type="password"
                  value={password}
                  prefix={<Icon type="lock" />}
                  onChange={this.handleChange}
                  onPressEnter={this.handleSubmit}
                />
              </Input.Group>
              <Button
                type="primary"
                onClick={this.handleSubmit}
                disabled={!this.isValid()}
                ref={c => { this.button = c; }}
              >
                  Done
              </Button>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    );
  }

  handleChange = evt => {
    const { id: field, value } = evt.target;

    if (field === "email") {
      this.props.setEmail(value);
    } else if (field === "password") {
      // TODO: store password in local state
      this.props.setPassword(value);
    }
  }

  isValid = () => {
    const { email, password } = this.props;

    return isEmail(email) && password !== "";
  }

  handleSubmit = async evt => {
    evt.preventDefault();
    if (!this.isValid()) return;

    const { email, password } = this.props;
    // TODO: timeout if this takes> 15s
    await this.button.setState({ loading: true });
    await this.props.loginUser(email, password);
  }
}
