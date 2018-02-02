import React from "react";
import { Menu, Icon, Checkbox } from "antd";
import { Link, withRouter } from "react-router-dom";
import { object, func } from "prop-types";
import { location as locationProps } from "react-router-prop-types";

import Button from "./Button";

const isProd = process.env.NODE_ENV === "production";
const getRoutes = loggedIn => [{
  href: "/",
  iconType: "home",
  name: "Home",
}].concat(loggedIn
  ? [{
    href: "/add",
    iconType: "plus-circle",
    name: "Add Note",
  }, {
    href: "/logout",
    iconType: "logout",
    name: "Logout",
  }]
  : [{
    href: "/login",
    iconType: "login",
    name: "Login",
  }, {
    href: "/signup",
    iconType: "user-add",
    name: "Sign Up",
  }]);

const NavBar = ({ location, ...rest }, { cognitoUser }) => {
  const validRoutes = getRoutes(Boolean(cognitoUser));
  // currentRoute might be undefined between redirect renders
  const currentRoute = validRoutes.find(e => e.href === location.pathname);

  return (
    <Menu
      theme="dark"
      selectedKeys={currentRoute ? [currentRoute.href] : []}
      style={{ tabIndex: -1 }}
    >
      {validRoutes.map(({ name, iconType, href }) => (
        <Menu.Item key={href}>
          <Icon type={iconType} />
          <Link to={href}>{name}</Link>
        </Menu.Item>
      ))}
      {!isProd && renderSettings({ ...rest })}
    </Menu>
  );
};

NavBar.propTypes = {
  location: locationProps,
  handleAdd: func.isRequired,
};

NavBar.contextTypes = {
  cognitoUser: object,
};

export default withRouter(NavBar);


/* eslint-disable */
function renderSettings({
  handleAdd, handleDebug, debugEnabled
}) {
  return (
    <Menu.SubMenu
      key="setting"
      title={<Icon type="setting" />}
    >
      {[10, 25, 50].map(amount => (
        <Menu.Item key={`add_${amount}`}>
          <Button
            onClick={handleAdd}
            data-amount={amount}
          >
          Add {amount} notes
          </Button>
        </Menu.Item>
      ))}
      <Menu.Item>
        <Checkbox
          defaultChecked={debugEnabled}
          onChange={handleDebug}
          style={{ color: "lightgray" }}
        >
          debug
        </Checkbox>
      </Menu.Item>
    </Menu.SubMenu>
  );
}
