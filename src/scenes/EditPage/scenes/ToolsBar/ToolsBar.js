import React, { useMemo } from "react";
import { connect } from "react-redux";
import { handleAddElement } from "reducers";
import classes from "./ToolsBar.module.scss";

import textIcon from "./images/text.svg";
import imageIcon from "./images/image.svg";
import uploadIcon from "./images/upload.svg";
import backgroundIcon from "./images/background.svg";

const ToolBarItem = ({ label, icon, action }) => (
  <li className={classes.toolsBarItem} onClick={action}>
    <div className={classes.toolsBarItemContent}>
      <img src={icon} alt="icon" />
      <span>{label}</span>
    </div>
  </li>
);

const ToolsBar = ({ handleAddElement }) => {
  const toolBarList = useMemo(
    () => [
      {
        label: "Text",
        icon: textIcon,
        action: () => handleAddElement(),
      },
      {
        label: "Image",
        icon: imageIcon,
        action: () => {},
      },
      {
        label: "Upload",
        icon: uploadIcon,
        action: () => {},
      },
      {
        label: "Back",
        icon: backgroundIcon,
        action: () => {},
      },
    ],
    [classes]
  );

  return (
    <div className={classes.toolsBar}>
      <ul className={classes.toolsBarList}>
        {toolBarList.map((item) => (
          <ToolBarItem
            icon={item.icon}
            label={item.label}
            action={item.action}
          />
        ))}
      </ul>
    </div>
  );
};

const mapDispatch = {
  handleAddElement,
};

export default connect(null, mapDispatch)(ToolsBar);
