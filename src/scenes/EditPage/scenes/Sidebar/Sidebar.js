import React from "react";
import TextOptions from "./components/TextOptions";

import classes from "./Sidebar.module.scss";

const Sidebar = () => {
  return (
    <div className={classes.sidebar}>
      <TextOptions />
    </div>
  );
};

export default Sidebar;
