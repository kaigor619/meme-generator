import React, { useState, useContext } from "react";
import { Number, Color } from "components/Form";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";
import SidebarSection from "components/SidebarSection";
import { Button } from "react-bootstrap";
import * as helper from "utils/helpers";
import AddBackground from "modals/AddBackground";
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

  const onChangeSizes = ({ target }) => {
    let { name, value } = target;

    if (value > 5000) value = 5000;

    const modifiedValue = helper.filterStyleValue(name, value);

    const updatedCanvas = {
      ...canvas,
      [name]: modifiedValue,
    };

    handleUpdateCanvas(updatedCanvas);

    const width = name === "width" ? modifiedValue : canvas.width;
    const height = name === "height" ? modifiedValue : canvas.height;
    const obj = canvasAPI.updateCanvasSize(width, height, true);
    handleUpdateCanvas({ ...canvas, ...obj });
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
              onChange={onChangeSizes}
              className={classes.numberInput}
            />
            <Number
              name="height"
              label="H"
              value={canvas?.height || ""}
              className={classes.numberInput}
              onChange={onChangeSizes}
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
            <Button
              variant="danger"
              className={classes.fullRow}
              onClick={() => updateCanvas("backgroundImage", "")}
            >
              Delete Background Image
            </Button>
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
