import React, { Component } from "react"
import { Row, Col, Input, Icon, Button } from "antd"
import { Auth } from "aws-amplify"

import styles from "./Login.css"

export default class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  isValid = () => {
    const { email, password } = this.state;

    return email !== "" && password !== "";
  }

  handleSubmit = evt => {
    evt.preventDefault();
    if (!this.isValid()) return;

    const { email, password } = this.state;

    return Auth.signIn(email, password)
      .then(console.log, window.alert)
  }

  render() {
    const { email, password } = this.state;

    return (
      <Row gutter={16} className="Login">
        <Col xs={24} md={6}>
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
