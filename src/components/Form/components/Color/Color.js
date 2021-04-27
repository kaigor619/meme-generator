import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";
import cls from "classnames";
import classes from "./Color.module.scss";

const Color = ({ name, value, className, onChange }) => {
  const [color, setColor] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    document.onclick = () => {
      setShowPicker(false);
    };
  }, []);

  const handleChange = (color, event) => {
    setColor(color.hex);
    onChange({ target: { name, value: color.hex } });
  };

  const handleClickPicker = (event) => {
    if (!showPicker) {
      event.stopPropagation();
    }

    setShowPicker(true);
  };

  return (
    <div className={cls(classes.colorWrapper, className)}>
      {showPicker && (
        <div
          className={classes.colorPickerWrapper}
          onClick={(e) => e.stopPropagation()}
        >
          <ChromePicker color={color} onChange={handleChange} />
        </div>
      )}
      <div className={classes.color}>
        <div className={classes.colorField}>
          <div
            style={{ backgroundColor: color }}
            className={classes.colorPicker}
            onClick={handleClickPicker}
          />
          <div className={classes.colorLabel}>
            <input id={name} name={name} value={color} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Color;
