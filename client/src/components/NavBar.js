import React from "react"
import { Menu, Icon } from "antd"
import { Link } from "react-router-dom"

import { List as routesArray } from "../routes"

export default props => (
  <Menu theme="dark" mode="inline">
    {routesArray.map(({ name, iconType, href }) => (
      <Menu.Item key={name}>
        <Icon type={iconType} />
        <Link to={href}>{name}</Link>
      </Menu.Item>
    ))}
  </Menu>
);
