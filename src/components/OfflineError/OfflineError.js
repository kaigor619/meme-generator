import React from "react";
import { Link } from "react-router-dom";
import paths from "types/paths";
import classes from "./OfflineError.module.scss";

const OfflineError = ({ text }) => {
  return (
    <div className={classes.errorWrap}>
      <div className={classes.errorContent}>
        <h1>Oops, try again</h1>
        <Link to={paths.main}>Main page</Link>
      </div>
    </div>
  );
};

export default OfflineError;
