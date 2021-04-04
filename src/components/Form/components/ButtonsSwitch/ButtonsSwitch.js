import React from "react";
import classes from "./ButtonsSwitch.module.scss";

const ButtonsSwitch = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = React.useState();

  const handleChange = (name) => {};

  return (
    <div className={classes.buttonsSwitch}>
      {options.map((item) => (
        <div className={classes.buttonsSwitchItem} key={item.name}>
          {item.value}
        </div>
      ))}
    </div>
  );
};

export default ButtonsSwitch;
