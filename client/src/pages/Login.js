import React, { Component } from "react"
import { Row, Col, Input, Icon, Button } from "antd"
import { connect } from "react-redux"

import styles from "./Login.css"
import { loginUser, setEmail, setPassword } from "../state/actions/auth-actions"

@connect(
  ({ auth: { email, password } }) => ({ email, password }),
  { loginUser, setEmail, setPassword }
)
export default class Login extends Component {
  handleChange = event => {
    const field = event.target.id;
    const value = event.target.value;

    if (field === "email") {
      this.props.setEmail(value);
    } else if (field === "password") {
      this.props.setPassword(value);
    }
  }

  isValid = () => {
    const { email, password } = this.props;

    return email !== "" && password !== "";
  }

  handleSubmit = evt => {
    evt.preventDefault();
    if (!this.isValid()) return;

    const { email, password } = this.props;
    this.props.loginUser(email, password);
  }

  render() {
    const { email, password } = this.props;

    return (
      <Row gutter={16} className="Login">
        <Col xs={24} md={12} lg={6}>
          <h3 style={{textAlign: "center"}}>Login</h3>
          <Input.Group className={styles.inputGroup}>
            <Input
              id="email"
              placeholder="email"
              value={email}
              prefix={<Icon type="user" style={{color: "rgba(0,0,0,.25)"}}/>}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
            />
            <Input
              id="password"
              placeholder="password"
              type="password"
              value={password}
              prefix={<Icon type="lock" style={{color: "rgba(0,0,0,.25)"}}/>}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
            />
            <Button
              type="primary"
              onClick={this.handleSubmit}
              disabled={!this.isValid()}
            >
              Done
            </Button>
          </Input.Group>
        </Col>
      </Row>
    );
  }
}
