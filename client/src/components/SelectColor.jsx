import React from "react";
import { Select } from "antd";
import { func } from "prop-types";

import { noteColors } from "../util";

const SelectColor = ({ onSelect, ...rest }) => (
  <Select
    placeholder="color"
    allowClear
    labelInValue
    onChange={onSelect}
    {...rest}
  >
    {noteColors.map(({ name, rgb }) => (
      <Select.Option
        style={{ background: rgb }}
        value={rgb}
        key={rgb}
      >
        {name}
      </Select.Option>
    ))}
  </Select>
);

SelectColor.propTypes = {
  onSelect: func.isRequired,
};

export default SelectColor;
