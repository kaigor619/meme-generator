import React, { useContext } from "react";
import cls from "classnames";
import { setElementCoords, toPx } from "utils/helpers";
import classes from "./EditSize.module.scss";
import CanvasContext from "contexts/canvas-context";
import { connect } from "react-redux";

const EditSize = ({ active, isBackgroundImage }) => {
  const { canvasAPI } = useContext(CanvasContext);

  const onMouseDown = (e) => {
    const item = e.target;
    const canvasContent = document.querySelector(".canvasContent");
    const canvasEdit = document.querySelector(".canvasEditWrap");
    const coordsEdit = canvasEdit.getBoundingClientRect();
    const editWidth = canvasEdit.clientWidth;
    const editHeight = canvasEdit.clientHeight;
    const scale = canvasAPI.getScale();

    const minWidth = 200;
    const minHeight = 200;
    const maxWidth = 5000;
    const maxHeight = 5000;

    const styleTop = (canvasContent.clientHeight - editHeight) / 2;
    const styleLeft = (canvasContent.clientWidth - editWidth) / 2;

    let calcWidth = coordsEdit.width;
    let calcHeight = coordsEdit.height;

    document.onmousemove = (e) => {
      const type = item.getAttribute("data-dot");
      const { clientX, clientY } = e;
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

      calcWidth = newWidth > maxWidth ? maxWidth : newWidth;
      calcHeight = newHeight > maxHeight ? maxHeight : newHeight;

      if (isBackgroundImage) {
        let k =
          (editWidth > editHeight ? editWidth : editHeight) /
          (editWidth < editHeight ? editWidth : editHeight);

        calcHeight = +parseInt(calcWidth / k);
      }

      canvasAPI.updateCanvasSize(calcWidth, calcHeight);
    };
    document.onmouseup = (e) => {
      console.log(canvasContent.clientWidth);
      document.onmousemove = false;
      canvasEdit.style.inset = "auto";
      canvasEdit.style.bottom = "auto";
      canvasEdit.style.right = "auto";
      canvasEdit.style.top = "50%";
      canvasEdit.style.left = "50%";
      canvasEdit.style.transform = "translate(-50%, -50%)";

      canvasAPI.updateCanvasSize(
        +parseInt(calcWidth),
        +parseInt(calcHeight),
        true
      );
    };
  };

  if (!active) return null;

  return (
    <>
      <div
        className={cls(classes.editCircle, classes.tl)}
        data-dot="tl"
        onMouseDown={onMouseDown}
      />
      <div
        className={cls(classes.editCircle, classes.tr)}
        data-dot="tr"
        onMouseDown={onMouseDown}
      />
      <div
        className={cls(classes.editCircle, classes.bl)}
        data-dot="bl"
        onMouseDown={onMouseDown}
      />
      <div
        className={cls(classes.editCircle, classes.br)}
        data-dot="br"
        onMouseDown={onMouseDown}
      />
    </>
  );
};

const mapDispatch = {};

export default connect(null, mapDispatch)(EditSize);
