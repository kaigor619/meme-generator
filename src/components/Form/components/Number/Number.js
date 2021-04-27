import React from "react";
import { Form } from "react-bootstrap";
import classes from "./Number.module.scss";
import PropTypes from "prop-types";

const Number = ({
  name,
  value,
  icon,
  label,
  onChange,
  className,
  ...other
}) => {
  return (
    <div className={classes.field}>
      <label htmlFor={name} className={classes.fieldLabel}>
        {icon ? <img src={icon} /> : (label && <span>{label}</span>) || null}
      </label>
      <div className={classes.fieldInput}>
        <Form.Control
          name={name}
          id={name}
          onChange={onChange}
          type="number"
          value={value}
          className={className}
          {...other}
        />
      </div>
    </div>
  );
};

Number.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  icon: PropTypes.string,
};

Number.defaultProps = {
  value: "",
  icon: "",
  label: "",
};

export default Number;
