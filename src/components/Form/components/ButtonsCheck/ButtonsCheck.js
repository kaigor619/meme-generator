import React, { useState, useEffect } from "react";
import cls from "classnames";
import PropTypes from "prop-types";
import classes from "./ButtonsCheck.module.scss";

const ButtonsCheck = ({ textStyle, options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (textStyle) {
      let arr = options
        .filter(
          (item) =>
            textStyle[item.option]?.split(" ").includes(item.value) || false
        )
        .map((item) => ({ option: item.option, value: item.value }));

      setSelectedOptions(arr);
    }
  }, [textStyle, options]);

  const handleChange = (item) => {
    const { value, option } = item;

    const isExist = selectedOptions.some((x) => x.value === value);

    let modifiedState = isExist
      ? selectedOptions.filter((x) => x.value !== value)
      : [...selectedOptions, { option, value }];

    setSelectedOptions(modifiedState);

    let newValue = modifiedState
      .filter((x) => x.option === option)
      .map((x) => x.value)
      .join(" ");

    onChange({ target: { name: option, value: newValue } });
  };

  return (
    <div className={classes.buttonsCheck}>
      {options.map((item) => (
        <div
          className={cls(classes.buttonsCheckItem, {
            [classes.activeItem]: selectedOptions.some(
              ({ value }) => value === item.value
            ),
          })}
          key={item.value}
          onClick={() => handleChange(item)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

ButtonsCheck.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
};

ButtonsCheck.defaultProps = {
  options: [],
  onChange: () => {},
};

export default ButtonsCheck;
