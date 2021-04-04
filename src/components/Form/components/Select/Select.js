import React from "react";
import Select from "react-select";
import cls from "classnames";

import classes from "./Select.module.scss";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const CustomSelect = ({ className }) => (
  <Select className={cls(classes.select, className)} options={options} />
);

export default CustomSelect;
