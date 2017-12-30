import React, { Component } from "react";
import { Layout } from "antd";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { bool, func } from "prop-types";
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
// import SignUp from "./pages/SignUp";

import { logoutUser } from "./state/actions/auth-actions";

@withRouter
@connect(
  ({ auth }) => ({ loggedIn: Boolean(auth.cognitoUser) }),
  { logoutUser },
)
export default class App extends Component {
  static childContextTypes = { loggedIn: bool };
  static propTypes = {
    loggedIn: bool.isRequired,
    logoutUser: func.isRequired,
  };

  getChildContext() {
    return {
      loggedIn: this.props.loggedIn,
    };
  }

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Helmet
          defaultTitle="Scratch"
          titleTemplate=" %s | Scratch"
        />
        <Layout.Sider collapsed>
          <NavBar />
        </Layout.Sider>
        <Layout>
          <Layout.Content className={styles.content}>
            <Switch>
              <AuthRoute path="/" exact component={Home} />
              <UnAuthRoute path="/login" exact component={Login} />
              <Route
                path="/logout"
                exact
                render={() => {
                  if (this.props.loggedIn) {
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
