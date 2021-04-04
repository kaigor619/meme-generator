import React from "react";
import Header from "components/Header";
import Sidebar from "./scenes/Sidebar";
import Canvas from "./scenes/Canvas";
import ToolsBar from "./scenes/ToolsBar";

import classes from "./EditPage.module.scss";

const Edit = () => {
  return (
    <div className={classes.editPage}>
      <Header />
      <div className={classes.editRow}>
        <div className={classes.toolsBarWrapper}>
          <ToolsBar />
        </div>
        <div className={classes.canvasWrapper}>
          <Canvas />
        </div>
        <div className={classes.sidebarWrapper}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Edit;
