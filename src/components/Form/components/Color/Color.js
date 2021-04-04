import React from "react";
import { ChromePicker } from "react-color";
import classes from "./Color.module.scss";

const Color = ({ value }) => {
  return (
    <div className={classes.color}>
      <div className={classes.colorField}>
        <div className={classes.colorPicker} />
        <div className={classes.colorLabel}>
          <span>{value}</span>
        </div>
        <div className={classes.colorOpacity}>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default Color;
