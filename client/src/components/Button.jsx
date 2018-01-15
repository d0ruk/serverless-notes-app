import React from "react";
import { node, func } from "prop-types";

const Button = ({ children, onClick, ...rest }) => (
  <span
    role="button"
    tabIndex="0"
    onKeyDown={onClick}
    onClick={onClick}
    {...rest}
  >
    {children}
  </span>
);

Button.propTypes = {
  onClick: func.isRequired,
  children: node,
};

export default Button;
