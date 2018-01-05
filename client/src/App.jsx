import React, { Component } from "react";
import { Layout } from "antd";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { object, func } from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import styles from "./App.css";
import NavBar from "./components/NavBar";
import AuthRoute from "./components/AuthRoute";
import UnAuthRoute from "./components/UnAuthRoute";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { logoutUser } from "./state/actions/auth-actions";

@withRouter
@connect(
  ({ auth }) => ({ cognitoUser: auth.cognitoUser }),
  { logoutUser },
)
export default class App extends Component {
  static childContextTypes = { cognitoUser: object };
  static propTypes = {
    cognitoUser: object, // TODO: shapeOf
    logoutUser: func.isRequired,
  };

  getChildContext() {
    return {
      cognitoUser: this.props.cognitoUser,
    };
  }

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Helmet
          defaultTitle="Scratch"
          titleTemplate="Scratch | %s"
        />
        <Layout.Sider collapsed>
          <NavBar />
        </Layout.Sider>
        <Layout>
          <Layout.Content className={styles.content}>
            <Switch>
              <AuthRoute path="/" exact component={Home} />
              <UnAuthRoute path="/login" exact component={Login} />
              <UnAuthRoute path="/signup" exact component={Signup} />
              <Route
                path="/logout"
                exact
                render={() => {
                  if (this.props.cognitoUser) {
                    this.props.logoutUser();
                  }

                  return <Redirect to="/" />;
                }}
              />
              <Route component={NotFound} />
            </Switch>
          </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}
