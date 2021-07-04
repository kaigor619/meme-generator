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

    const minWidth = 200;
    const minHeight = 200;

    const styleTop = (canvasContent.clientHeight - editHeight) / 2;
    const styleLeft = (canvasContent.clientWidth - editWidth) / 2;

    let calcWidth = 0;
    let calcHeight = 0;

    document.onmousemove = (e) => {
      const type = item.getAttribute("data-dot");
      const { clientX, clientY } = e;
      let newWidth, newHeight;
      canvasEdit.style.transform = "none";
      const prevWidth = canvasEdit.clientWidth;
      const prevHeight = canvasEdit.clientHeight;

      if (type === "tr") {
        setElementCoords(canvasEdit, [
          "auto",
          "auto",
          toPx(styleTop),
          toPx(styleLeft),
        ]);

        newWidth = clientX - coordsEdit.left;
        newHeight = coordsEdit.bottom - clientY;
      } else if (type === "br") {
        setElementCoords(canvasEdit, [
          toPx(styleTop),
          "auto",
          "auto",
          toPx(styleLeft),
        ]);

        newWidth = clientX - coordsEdit.left;
        newHeight = clientY - coordsEdit.top;
      } else if (type === "bl") {
        setElementCoords(canvasEdit, [
          toPx(styleTop),
          toPx(styleLeft),
          "auto",
          "auto",
        ]);

        newWidth = coordsEdit.right - clientX;
        newHeight = clientY - coordsEdit.top;
      } else if (type === "tl") {
        setElementCoords(canvasEdit, [
          "auto",
          toPx(styleLeft),
          toPx(styleTop),
          "auto",
        ]);

        newWidth = coordsEdit.right - clientX;
        newHeight = coordsEdit.bottom - clientY;
      }

      calcWidth = +parseInt(newWidth <= minWidth ? minWidth : newWidth);
      calcHeight = +parseInt(newHeight <= minHeight ? minHeight : newHeight);

      if (isBackgroundImage) {
        let k =
          (prevWidth > prevHeight ? prevWidth : prevHeight) /
          (prevWidth < prevHeight ? prevWidth : prevHeight);

        let diffW = Math.abs(calcWidth - prevWidth);
        let diffH = Math.abs(calcHeight - prevHeight);

        if (diffW > diffH) {
          if (prevWidth > prevHeight) {
            console.log(calcWidth, k);
            // calcHeight = +parseInt(calcWidth / k);
          }
        }
      }

      canvasAPI.updateCanvasSize(calcWidth, calcHeight);
    };
    document.onmouseup = (e) => {
      document.onmousemove = false;
      canvasEdit.style.inset = "auto";
      canvasEdit.style.bottom = "auto";
      canvasEdit.style.right = "auto";
      canvasEdit.style.top = "50%";
      canvasEdit.style.left = "50%";
      canvasEdit.style.transform = "translate(-50%, -50%)";

      const { clientHeight, clientWidth } = canvasContent;
      calcWidth = calcWidth > clientWidth ? clientWidth : calcWidth;
      calcHeight = calcHeight > clientHeight ? clientHeight : calcHeight;
      canvasAPI.updateCanvasSize(+parseInt(calcWidth), +parseInt(calcHeight));
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
