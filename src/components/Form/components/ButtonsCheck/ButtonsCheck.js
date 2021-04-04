import React from "react";
import classes from "./ButtonsCheck.module.scss";

const ButtonsCheck = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = React.useState();

  const handleChange = (name) => {};

  return (
    <div className={classes.buttonsCheck}>
      {options.map((item) => (
        <div
          className={classes.buttonsCheckItem}
          key={item.name}
          onClick={() => handleChange(item.name)}
        >
          {item.value}
          {/* <span className="underline">T</span> */}
        </div>
      ))}
    </div>
  );
};

export default ButtonsCheck;
