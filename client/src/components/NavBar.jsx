import React from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import { bool } from "prop-types";

function getRoutes(loggedIn) {
  return [
    {
      href: "/",
      iconType: "home",
      name: "Home",
    },
  ].concat(loggedIn
    ? [{
      href: "/logout",
      iconType: "logout",
      name: "Logout",
    }]
    : [{
      href: "/login",
      iconType: "login",
      name: "Login",
    },
    {
      href: "/signup",
      iconType: "user-add",
      name: "Sign Up",
    }]);
}

const NavBar = (_, { loggedIn }) => (
  <Menu theme="dark" mode="vertical">
    {getRoutes(loggedIn).map(({ name, iconType, href }) => (
      <Menu.Item key={name}>
        <Icon type={iconType} />
        <Link to={href}>{name}</Link>
      </Menu.Item>
    ))}
  </Menu>
);

NavBar.contextTypes = {
  loggedIn: bool,
};

export default NavBar;
