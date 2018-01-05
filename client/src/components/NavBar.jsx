import React from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import { object } from "prop-types";

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

const NavBar = (_, { cognitoUser }) => (
  <Menu theme="dark">
    {getRoutes(Boolean(cognitoUser)).map(({ name, iconType, href }) => (
      <Menu.Item key={name}>
        <Icon type={iconType} />
        <Link to={href}>{name}</Link>
      </Menu.Item>
    ))}
  </Menu>
);

NavBar.contextTypes = {
  cognitoUser: object,
};

// TODO: either sync the router state with the menu state or use a different component
export default withRouter(NavBar);
