import React from "react";
import Select from "react-select";
import cls from "classnames";

import classes from "./Select.module.scss";

const CustomSelect = ({ options, className, defaultValue, onChange }) => (
  <Select
    className={cls(classes.select, className)}
    options={options}
    defaultValue={defaultValue}
    onChange={onChange}
  />
);

export default CustomSelect;
