import React from "react";
import { Layout } from "antd";

import slsStackLogo from "../assets/sls-stack.png";
import { wrapper, logo } from "./Footer.css";

export default () => (
  <Layout.Footer className={wrapper}>
    <a href="https:www.serverless-stack.com">
      <img
        className={logo}
        src={slsStackLogo}
        alt="Serverless Stack logo"
      />
    </a>
  </Layout.Footer>
);
