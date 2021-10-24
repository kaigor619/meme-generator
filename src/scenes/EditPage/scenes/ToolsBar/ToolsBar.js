import React, { useMemo, useContext } from "react";
import { connect } from "react-redux";
import { handleAddElement, handleChangeActiveElement } from "reducers";
import CanvasContext from "contexts/canvas-context";
import * as helpers from "utils/helpers";

import classes from "./ToolsBar.module.scss";

import textIcon from "./images/text.svg";
// import imageIcon from "./images/image.svg";
// import uploadIcon from "./images/upload.svg";
// import backgroundIcon from "./images/background.svg";

const ToolBarItem = ({ label, icon, action }) => (
  <li className={classes.toolsBarItem} onClick={action}>
    <div className={classes.toolsBarItemContent}>
      <img src={icon} alt="icon" />
      <span>{label}</span>
    </div>
  </li>
);

const ToolsBar = ({ handleAddElement, handleChangeActiveElement }) => {
  const { canvasAPI } = useContext(CanvasContext);

  const handleAddTextElement = () => {
    const element = helpers.addTextElement();

    canvasAPI.addElement(element);
    handleAddElement(element);
  };

  const toolBarList = useMemo(
    () => [
      {
        label: "Text",
        icon: textIcon,
        action: handleAddTextElement,
      },
      // {
      //   label: "Image",
      //   icon: imageIcon,
      //   action: () => {},
      // },
      // {
      //   label: "Upload",
      //   icon: uploadIcon,
      //   action: () => {},
      // },
      // {
      //   label: "Back",
      //   icon: backgroundIcon,
      //   action: () => {},
      // },
    ],
    [classes, canvasAPI]
  );

  return (
    <div
      className={classes.toolsBar}
      onClick={() => handleChangeActiveElement("")}
    >
      <ul className={classes.toolsBarList} onClick={(e) => e.stopPropagation()}>
        {toolBarList.map((item) => (
          <ToolBarItem
            key={item.label}
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
  handleChangeActiveElement,
};

export default connect(null, mapDispatch)(ToolsBar);
