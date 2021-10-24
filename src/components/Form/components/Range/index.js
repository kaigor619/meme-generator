import React, { useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import classes from "./Range.module.scss";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

const MyRange = () => {
  const [value, setValue] = useState(100);

  return (
    <div className={classes.grid}>
      <RangeSlider
        value={value}
        max={200}
        onChange={(changeEvent) => setValue(changeEvent.target.value)}
      />
    </div>
  );
};

export default MyRange;
