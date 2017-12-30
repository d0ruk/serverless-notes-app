import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { func, string } from "prop-types";
import { Helmet } from "react-helmet";
import { Row, Col, Input, Icon, Button } from "antd";

import styles from "./Signup.css";
import { setEmail, setPassword } from "../state/actions/auth-actions";

@connect(
  ({ auth: { email, password, error } }) => ({ email, password, error }),
  { setEmail, setPassword },
)
export default class SignUp extends Component {
  static propTypes = {
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
      <Fragment>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <Row>
          <Col xs={24} md={12} lg={6} className={styles.column}>
            <h3 className={styles.header}>
              Sign Up
            </h3>
            <hr />
            {/* {error && <div className="error">{error}</div>} */}
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
                placeholder="pick a password"
                defaultValue=""
                type="password"
                value={password}
                prefix={<Icon type="lock" className={styles.icon} />}
                ref={c => { this.passwordField = c; }}
                onChange={this.handleChange}
                onPressEnter={this.handleSubmit}
              />
              <Input
                id="confirm"
                placeholder="confirm password"
                type="password"
                prefix={<Icon type="lock" className={styles.icon} />}
                ref={c => { this.confirmField = c; }}
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
      </Fragment>
    );
  }

  isValid = () => {
    const { email, password } = this.props;

    return /\S+@\S+\.\S+/.test(email) && password !== "";
  }

  handleSubmit = async evt => {
    evt.preventDefault();
    if (!this.isValid()) return;

    const { email, password } = this.props;

    if (this.confirmField.input.value !== password) {
      this.confirmField.input.value = "";
      this.props.setPassword("");
      this.passwordField.focus();
      return;
    }

    await this.button.setState({ loading: true });
    await new Promise(res => setTimeout(res, 1500));
    await this.button.setState({ loading: false });
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
