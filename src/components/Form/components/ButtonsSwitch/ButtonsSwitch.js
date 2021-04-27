import React, { useEffect, useState } from "react";
import cls from "classnames";
import classes from "./ButtonsSwitch.module.scss";
import PropTypes from "prop-types";

const ButtonsSwitch = ({ name, value, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState([value]);

  useEffect(() => {
    if (value) {
      setSelectedOption(value);
    }
  }, [value]);

  const handleChange = (value) => {
    setSelectedOption(value);
    onChange({ target: { name, value } });
  };

  return (
    <div className={classes.buttonsSwitch}>
      {options.map((item) => (
        <div
          className={cls(classes.buttonsSwitchItem, {
            [classes.activeItem]: selectedOption === item.value,
          })}
          onClick={() => handleChange(item.value)}
          key={item.value}
        >
          <img src={item.icon} alt="" />
        </div>
      ))}
    </div>
  );
};

ButtonsSwitch.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
};

ButtonsSwitch.defaultProps = {
  value: "",
  name: "",
  options: [],
  onChange: () => {},
};

export default ButtonsSwitch;
