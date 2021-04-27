import React, { useState, useEffect } from "react";
import TextOptions from "./components/TextOptions";
import CanvasOptions from "./components/CanvasOptions";
import { connect } from "react-redux";
import { ELEMENT_TYPE } from "types/constant";

import classes from "./Sidebar.module.scss";

const Sidebar = ({ canvas, activeId, elements }) => {
  const [elementType, setElementType] = useState("");

  useEffect(() => {
    if (!activeId) setElementType("");

    if (activeId) {
      const element = elements?.find((item) => item.id === activeId) || null;
      const isCanvas = canvas.id === activeId;

      if (element) setElementType(element.type);
      else if (isCanvas) setElementType(ELEMENT_TYPE.canvas);
    }
  }, [activeId, elements, canvas]);

  return (
    <div className={classes.sidebar}>
      {elementType === ELEMENT_TYPE.text && <TextOptions />}
      {elementType === ELEMENT_TYPE.canvas && <CanvasOptions />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeId: state.activeId,
  elements: state.elements,
  canvas: state.canvas,
});

export default connect(mapStateToProps)(Sidebar);
