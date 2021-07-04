import React, { useState, useEffect } from "react";
import { RgbaStringColorPicker } from "react-colorful";
import cls from "classnames";
import classes from "./Color.module.scss";

const Color = ({ name, value, className, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    document.onclick = () => {
      setShowPicker(false);
    };
  }, []);

  const handleChange = (color) => {
    onChange({ target: { name, value: color } });
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
          <RgbaStringColorPicker color={value} onChange={handleChange} />
        </div>
      )}
      <div className={classes.color}>
        <div className={classes.colorField}>
          <div
            style={{ backgroundColor: value }}
            className={classes.colorPicker}
            onClick={handleClickPicker}
          />
          <div className={classes.colorLabel}>
            <input id={name} name={name} value={value} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Color;
