import React from "react";
import { Form } from "react-bootstrap";
import classes from "./Number.module.scss";
import PropTypes from "prop-types";

const Number = ({ value, icon }) => {
  return (
    <div className={classes.field}>
      {icon && (
        <div className={classes.fieldIcon}>
          <img src={icon} alt="Font size" />
        </div>
      )}
      <div className={classes.fieldInput}>
        <Form.Control type="number" value={value} />
      </div>
    </div>
  );
};

Number.propTypes = {
  value: PropTypes.string,
  icon: PropTypes.string,
};

Number.propTypes = {
  value: "",
  icon: "",
};

export default Number;
