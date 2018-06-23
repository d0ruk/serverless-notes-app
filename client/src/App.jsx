import React, { Component } from "react";
import { Layout, notification } from "antd";
import { Route, Switch, withRouter } from "react-router-dom";
import { object, func } from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import range from "lodash/range";

import styles from "./App.css";
import NavBar from "./components/NavBar";
import AuthRoute from "./components/AuthRoute";
import UnAuthRoute from "./components/UnAuthRoute";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import NewNote from "./pages/NewNote";
import EditNote from "./pages/EditNote";

import { createNote } from "./state/actions/notes-actions";
import { makeRandomNote } from "./util";

@withRouter
@connect(
  ({ auth: { cognitoUser } }) => ({ cognitoUser }),
  { createNote },
)
export default class App extends Component {
  static childContextTypes = { cognitoUser: object };
  static propTypes = {
    cognitoUser: object, // eslint-disable-line
    createNote: func.isRequired,
  };

  getChildContext() {
    return {
      cognitoUser: this.props.cognitoUser,
    };
  }

  componentWillMount() {
    notification.config({
      placement: "topRight",
      top: 10,
      duration: 3,
    });
  }

  render() {
    return (
      <Layout className={styles.wrapper}>
        <Helmet
          defaultTitle="Scratch"
          titleTemplate="Scratch | %s"
        />
        <Layout.Sider collapsed>
          <NavBar
            handleAdd={this.handleAdd}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Content className={styles.content}>
            <Switch>
              <AuthRoute path="/" exact component={Home} />
              <UnAuthRoute path="/login" exact component={Login} />
              <UnAuthRoute path="/signup" exact component={Signup} />
              <AuthRoute path="/add" exact component={NewNote} />
              <AuthRoute path="/edit/:noteId" exact component={EditNote} />
              <Route path="/logout" exact component={Logout} />
              <Route component={NotFound} />
            </Switch>
          </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }

  handleAdd = evt => {
    if (!this.props.cognitoUser) return;
    const { amount } = evt.target.dataset;

    notification.info({
      message: `Adding ${amount} random notes.`,
      key: "add-notes",
      duration: 0,
    });

    range(amount)
      .reduce(acc => acc.then(() => {
        const note = makeRandomNote();
        return this.props.createNote(note);
      }), Promise.resolve())
      .catch(console.error) // eslint-disable-line
      .finally(() => {
        notification.close("add-notes");
      });
  }
}
