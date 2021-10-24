import React, { useContext } from "react";
import { useBreakpoints } from "react-breakpoints-hook";
import cls from "classnames";
import { setElementCoords, toPx } from "utils/helpers";
import classes from "./EditSize.module.scss";
import CanvasContext from "contexts/canvas-context";
import { handleUpdateCanvas } from "reducers";
import { connect } from "react-redux";

const EditSize = ({
  canvas,
  active,
  isBackgroundImage,
  handleUpdateCanvas,
}) => {
  const { canvasAPI } = useContext(CanvasContext);

  const { xs } = useBreakpoints({
    xs: { min: 0, max: 768 },
  });

  const onMouseDown = (e) => {
    const item = e.target;
    const canvasContent = document.querySelector(".canvasContent");
    const canvasEdit = document.querySelector(".canvasEditWrap");
    const coordsEdit = canvasEdit.getBoundingClientRect();
    const editWidth = canvasEdit.clientWidth;
    const editHeight = canvasEdit.clientHeight;
    const scale = canvasAPI.getScale();

    const minWidth = 100;
    const minHeight = 100;
    const maxWidth = 5000;
    const maxHeight = 5000;

    const styleTop = (canvasContent.clientHeight - editHeight) / 2;
    const styleLeft = (canvasContent.clientWidth - editWidth) / 2;

    let calcWidth = coordsEdit.width;
    let calcHeight = coordsEdit.height;

    const moveType = xs ? "touchmove" : "mousemove";
    const endType = xs ? "touchend" : "mouseup";

    function listenerMove(e) {
      let clientX,
        clientY = 0;

      if (xs) {
        const changedTouches = e.changedTouches[0];
        clientX = changedTouches.clientX;
        clientY = changedTouches.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const type = item.getAttribute("data-dot");
      let newWidth, newHeight;
      canvasEdit.style.transform = "none";

      if (type === "tr") {
        setElementCoords(canvasEdit, [
          "auto",
          "auto",
          toPx(styleTop),
          toPx(styleLeft),
        ]);

        newWidth = (clientX - coordsEdit.left) / scale;
        newHeight = (coordsEdit.bottom - clientY) / scale;
      } else if (type === "br") {
        setElementCoords(canvasEdit, [
          toPx(styleTop),
          "auto",
          "auto",
          toPx(styleLeft),
        ]);

        newWidth = (clientX - coordsEdit.left) / scale;
        newHeight = (clientY - coordsEdit.top) / scale;
      } else if (type === "bl") {
        setElementCoords(canvasEdit, [
          toPx(styleTop),
          toPx(styleLeft),
          "auto",
          "auto",
        ]);

        newWidth = (coordsEdit.right - clientX) / scale;
        newHeight = (clientY - coordsEdit.top) / scale;
      } else if (type === "tl") {
        setElementCoords(canvasEdit, [
          "auto",
          toPx(styleLeft),
          toPx(styleTop),
          "auto",
        ]);

        newWidth = (coordsEdit.right - clientX) / scale;
        newHeight = (coordsEdit.bottom - clientY) / scale;
      }

      calcWidth = +parseInt(newWidth <= minWidth ? minWidth : newWidth);
      calcHeight = +parseInt(newHeight <= minHeight ? minHeight : newHeight);

      calcWidth = newWidth > maxWidth ? maxWidth : calcWidth;
      calcHeight = newHeight > maxHeight ? maxHeight : calcHeight;

      if (isBackgroundImage) {
        let k =
          (editWidth > editHeight ? editWidth : editHeight) /
          (editWidth < editHeight ? editWidth : editHeight);

        calcHeight = +parseInt(calcWidth / k);

        if (editHeight > editWidth) {
          calcHeight = +parseInt(calcWidth * k);
        }
      }

      const { width, height } = canvasAPI.updateCanvasSize(
        calcWidth,
        calcHeight
      );
      handleUpdateCanvas({ ...canvas, width, height });
    }

    function listenerEnd(e) {
      window.removeEventListener(moveType, listenerMove);
      canvasEdit.style.inset = "auto";
      canvasEdit.style.bottom = "auto";
      canvasEdit.style.right = "auto";
      canvasEdit.style.top = "50%";
      canvasEdit.style.left = "50%";
      canvasEdit.style.transform = "translate(-50%, -50%)";

      const { width, height } = canvasAPI.updateCanvasSize(
        +parseInt(calcWidth),
        +parseInt(calcHeight),
        true
      );

      handleUpdateCanvas({ ...canvas, width, height });
    }

    window.addEventListener(moveType, listenerMove);
    document.addEventListener(endType, listenerEnd, { once: true });
  };

  if (!active) return null;

  return (
    <>
      <div
        className={cls(classes.editCircle, classes.tl)}
        data-dot="tl"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      />
      <div
        className={cls(classes.editCircle, classes.tr)}
        data-dot="tr"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      />
      <div
        className={cls(classes.editCircle, classes.bl)}
        data-dot="bl"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      />
      <div
        className={cls(classes.editCircle, classes.br)}
        data-dot="br"
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      />
    </>
  );
};

const mapStateToProps = ({ canvas }) => ({
  canvas,
});

const mapDispatch = {
  handleUpdateCanvas,
};

export default connect(mapStateToProps, mapDispatch)(EditSize);
