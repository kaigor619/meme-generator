import React from "react";
import cls from "classnames";
import classes from "./EditSize.module.scss";

const EditSize = () => {
  return (
    <>
      <div className={cls(classes.editCircle, "tl")} />
      <div className={cls(classes.editCircle, "tr")} />
      <div className={cls(classes.editCircle, "bl")} />
      <div className={cls(classes.editCircle, "br")} />
    </>
  );
};

export default EditSize;
