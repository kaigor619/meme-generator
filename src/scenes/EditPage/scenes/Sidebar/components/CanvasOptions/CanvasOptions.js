import React, { useMemo, useState, useEffect } from "react";
import { Number, Color } from "components/Form";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";
import SidebarSection from "components/SidebarSection";
import { Button } from "react-bootstrap";
import * as helper from "utils/helpers";
import AddBackground from "modals/AddBackground";
import cls from "classnames";
import closeIcon from "assets/images/close.svg";

import classes from "./CanvasOptions.module.scss";

const CanvasOptions = ({ canvas, handleUpdateCanvas }) => {
  const [isBackgroundModal, setIsBackgroundModal] = useState(false);
  const [fields, setFields] = useState(canvas);

  useEffect(() => {
    setFields((state) => ({
      ...state,
      width: canvas.width,
      height: canvas.height,
    }));
  }, [canvas]);

  const onChangeSize = ({ target }) => {
    const { name, value } = target;
    const modifiedValue = helper.filterStyleValue(name, value);
    setFields((state) => ({ ...state, [name]: modifiedValue }));
  };

  const onChangeStyle = ({ target }) => {
    const { name, value } = target;
    const modifiedValue = helper.filterStyleValue(name, value);
    handleUpdate();
    setFields((state) => ({ ...state, [name]: modifiedValue }));
  };

  const handleUpdate = () => {
    handleUpdateCanvas({
      ...canvas,
      ...fields,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleDeleteBackground = () => {
    handleUpdateCanvas({
      ...canvas,
      backgroundImage: "",
    });
  };

  return (
    <>
      <SidebarSection title="Size">
        <form action="" onSubmit={onSubmit}>
          <div className={classes.sectionGrid}>
            <Number
              name="width"
              label="W"
              value={fields.width || ""}
              onBlur={handleUpdate}
              onChange={onChangeSize}
              className={classes.numberInput}
            />
            <Number
              name="height"
              label="H"
              value={fields?.height || ""}
              className={classes.numberInput}
              onChange={onChangeSize}
              onBlur={handleUpdate}
            />
          </div>
          <button type="submit" hidden></button>
        </form>
      </SidebarSection>
      <SidebarSection title="Background">
        <div className={classes.sectionGrid}>
          <Color
            name="fill"
            value={fields.fill}
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
                  onClick={handleDeleteBackground}
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
