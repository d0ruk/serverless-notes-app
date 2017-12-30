import React, { Component } from "react";
import { Row, Col, Input, Icon, Button } from "antd";
import { connect } from "react-redux";
import { func, string, bool } from "prop-types";
import { Helmet } from "react-helmet";

import styles from "./Login.css";
import { loginUser, setEmail, setPassword } from "../state/actions/auth-actions";

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
    error: string,
  }

  componentDidMount() {
    this.emailField.focus();
  }

  render() {
    const { email, password, error } = this.props;

    return (
      <Row>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Col xs={24} md={12} lg={6} className={styles.column}>
          <h3 className={styles.header}>
            Login
          </h3>
          <hr />
          {error && <div className="error">{error}</div>}
          <Input.Group>
            <Input
              id="email"
              type="text"
              placeholder="email"
              value={email}
              prefix={<Icon type="user" className={styles.icon} />}
              ref={c => { this.emailField = c; }}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
            />
            <Input
              id="password"
              placeholder="password"
              type="password"
              value={password}
              prefix={<Icon type="lock" className={styles.icon} />}
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

    return /\S+@\S+\.\S+/.test(email) && password !== "";
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
