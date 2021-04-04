import React from "react";
import classes from "./SidebarSection.module.scss";

const SidebarSection = ({ title, children }) => {
  return (
    <div className={classes.section}>
      <h5 className={classes.sectionTitle}>{title}</h5>
      {children}
    </div>
  );
};

export default SidebarSection;
