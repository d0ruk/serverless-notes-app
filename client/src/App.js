import slsStackLogo from "./assets/sls-stack.png"
import React, { Component } from "react"
import { Layout } from "antd"
import { Component as Routes } from "./routes"

import styles from "./App.css"
import NavBar from "./components/NavBar"

export default class App extends Component {
  render() {
    return (
      <Layout className={styles.wrapper}>
        <Layout.Sider collapsed={true}>
          <NavBar />
        </Layout.Sider>
        <Layout>
          <Layout.Content className={styles.content}>
            <Routes />
          </Layout.Content>
          <Layout.Footer className={styles.footer}>
            <a href="https:www.serverless-stack.com">
              <img
                className={styles.logo}
                src={slsStackLogo}
                alt="Serverless Stack logo"
              />
            </a>
          </Layout.Footer>
        </Layout>
      </Layout>
    );
  }
}
