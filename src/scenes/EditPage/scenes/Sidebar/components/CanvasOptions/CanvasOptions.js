import React, { useMemo, useState, useContext } from "react";
import { Number, Color, Range } from "components/Form";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";
import SidebarSection from "components/SidebarSection";
import { Button, Form } from "react-bootstrap";
import * as helper from "utils/helpers";
import AddBackground from "modals/AddBackground";
import cls from "classnames";
import closeIcon from "assets/images/close.svg";
import CanvasContext from "contexts/canvas-context";

import classes from "./CanvasOptions.module.scss";

const CanvasOptions = ({ canvas, handleUpdateCanvas }) => {
  const [isBackgroundModal, setIsBackgroundModal] = useState(false);
  const { canvasAPI } = useContext(CanvasContext);

  const onChangeStyle = ({ target }) => {
    const { name, value } = target;
    const modifiedValue = helper.filterStyleValue(name, value);

    updateCanvas(name, modifiedValue);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const updateCanvas = (name, value) => {
    const updatedCanvas = {
      ...canvas,
      [name]: value,
    };
    handleUpdateCanvas(updatedCanvas);
    canvasAPI.updateCanvas(updatedCanvas);
  };

  return (
    <>
      <SidebarSection title="Size">
        <form action="" onSubmit={onSubmit}>
          <div className={classes.sectionGrid}>
            <Number
              name="width"
              label="W"
              value={canvas.width || ""}
              onChange={onChangeStyle}
              className={classes.numberInput}
            />
            <Number
              name="height"
              label="H"
              value={canvas?.height || ""}
              className={classes.numberInput}
              onChange={onChangeStyle}
            />
          </div>
          <button type="submit" hidden></button>
        </form>
      </SidebarSection>

      <SidebarSection title="Background">
        <div className={classes.sectionGrid}>
          <Color
            name="fill"
            value={canvas.fill}
            className={classes.fullRow}
            onChange={onChangeStyle}
          />

          {!canvas.backgroundImage ? (
            <Button
              className={classes.fullRow}
              onClick={() => setIsBackgroundModal(true)}
            >
              Add Background Image
            </Button>
          ) : (
            <div className={cls(classes.fullRow, classes.image)}>
              <div className={classes.overlay}>
                <img
                  src={closeIcon}
                  onClick={() => updateCanvas("backgroundImage", "")}
                  className={classes.closeImage}
                  alt="close"
                />
                <p onClick={() => setIsBackgroundModal(true)}>Change</p>
              </div>
              <img
                src={canvas.backgroundImage}
                className={classes.backgroundImage}
                alt=""
              />
            </div>
          )}

          <AddBackground
            show={isBackgroundModal}
            onHide={() => setIsBackgroundModal(false)}
          />
        </div>
      </SidebarSection>
    </>
  );
};

const mapStateToProps = (state) => ({
  canvas: state.canvas,
});

const mapDispatch = {
  handleUpdateCanvas,
};

export default connect(mapStateToProps, mapDispatch)(CanvasOptions);
