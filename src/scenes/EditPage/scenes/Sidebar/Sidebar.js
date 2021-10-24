import React, { useState, useEffect } from "react";
import TextOptions from "./components/TextOptions";
import CanvasOptions from "./components/CanvasOptions";
import Modal from "components/Modal";
import { connect } from "react-redux";
import { ELEMENT_TYPE } from "types/constant";
import { useBreakpoints, useCurrentWidth } from "react-breakpoints-hook";
import { Button } from "react-bootstrap";
import { ReactComponent as EditIcon } from "assets/images/edit.svg";

import classes from "./Sidebar.module.scss";

const Sidebar = ({ canvas, activeId, elements }) => {
  const [elementType, setElementType] = useState("");
  const [modalType, setModalType] = useState("");

  const { xs } = useBreakpoints({
    xs: { min: 0, max: 768 },
  });

  useEffect(() => {
    if (!activeId) setElementType("");

    if (activeId) {
      const element = elements?.find((item) => item.id === activeId) || null;
      const isCanvas = canvas.id === activeId;

      if (element) setElementType(element.type);
      else if (isCanvas) setElementType(ELEMENT_TYPE.canvas);
    }
  }, [activeId, elements, canvas]);

  const handleEditElement = () => {
    const element = elements?.find((item) => item.id === activeId) || null;
    const isCanvas = canvas.id === activeId;

    if (element) setModalType("element");
    else if (isCanvas) setModalType("canvas");
  };

  if (xs && !activeId) return null;

  if (xs) {
    return (
      <>
        {modalType && (
          <Modal
            close
            show={Boolean(modalType)}
            onHide={() => setModalType("")}
          >
            {modalType === "element" && <TextOptions />}
            {modalType === "canvas" && <CanvasOptions />}
          </Modal>
        )}
        <button className={classes.editIcon} onClick={handleEditElement}>
          <EditIcon />
        </button>
      </>
    );
  }

  return (
    <div className={classes.sidebarWrapper}>
      <div className={classes.sidebar}>
        {elementType === ELEMENT_TYPE.text && <TextOptions />}
        {elementType === ELEMENT_TYPE.canvas && <CanvasOptions />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  activeId: state.activeId,
  elements: state.elements,
  canvas: state.canvas,
});

export default connect(mapStateToProps)(Sidebar);
