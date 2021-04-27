import React, { Component, createRef } from "react";
import { ELEMENT_TYPE } from "types/constant";
import { TEXT_OPTIONS_TEMPLATE, CANVAS_CONFIG } from "types/elements";
import { connect } from "react-redux";
import {
  handleUpdateStyleElement,
  handleChangeActiveElement,
  handleUpdateCanvas,
  handleUpdateStage,
} from "reducers";
import * as konvaService from "services/konva";
import Konva from "konva";
import * as helper from "utils/helpers";
import canvasBackground from "assets/images/canvas-background.jpg";

import "./Canvas.scss";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.hoverRef = React.createRef();
    this.canvasWrapper = React.createRef();
  }
  stage = null;
  background = {
    backgroundRect: null,
    backgroundImage: null,
    layer: null,
  };
  elementsState = [];
  transformer = null;
  canvasNode = null;

  handleClickFrame = () => {
    this.handleDeleteTransformerExcept();
    this.props.handleChangeActiveElement("");
    helper.toggleCanvasEdit(false);
  };

  handleDeleteTransformerExcept(id) {
    this.elementsState
      .filter((item) => item.type !== ELEMENT_TYPE.background)
      .forEach((item) => {
        let isTransforming = item.transformer.isTransforming();

        // ** understand why isTransforming always false
        // if (isTransforming && item.id !== id) {
        if (item.id !== id) {
          item.transformer.hide();
          item.transformer.enabledAnchors([]);
          item.layer.draw();
        }
      });
  }

  init = () => {
    const { elements, canvas } = this.props;

    const config = helper.getCanvasConfig(canvas);

    const stage = new Konva.Stage({ ...config });
    this.canvasNode = document.getElementById(canvas.container);
    this.stage = stage;

    var layer = new Konva.Layer();
    this.background.layer = layer;

    if (canvas.backgroundImage) {
      const imageObj = new Image();
      imageObj.onload = () => {
        const yoda = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: canvas.width,
          height: canvas.height,
        });

        this.background.backgroundImage = yoda;

        layer.add(yoda);
        layer.batchDraw();
      };
      imageObj.src = canvas.backgroundImage;
    } else {
      const imageObj = new Image();

      imageObj.onload = () => {
        const yoda = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width: canvas.width,
          height: canvas.height,
        });

        this.background.backgroundImage = yoda;

        yoda.hide();

        layer.add(yoda);
        layer.batchDraw();
      };
      imageObj.src = canvasBackground;
    }

    const rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
      fill: canvas.fill,
    });
    this.background.backgroundRect = rect;
    layer.add(rect);

    layer.on("click", (e) => {
      console.log("background click");
      this.props.handleChangeActiveElement(canvas.id);
      helper.toggleCanvasEdit(true);
      this.handleDeleteTransformerExcept();
    });

    this.stage.add(layer);
    layer.draw();

    this.createElements(elements, { isAdd: false });
    this.props.handleUpdateStage(this.stage);
  };

  updateCanvas = (options) => {
    const canvasContent = document.querySelector(".canvasContent");
    if (options.width !== this.props.canvas.width) {
      if (options.width > canvasContent.clientWidth) {
        options.width = canvasContent.clientWidth;
        // let x =
        //   (100 * (options.width - canvasContent.clientWidth)) / options.width;
        // console.log(options.width, canvasContent.clientWidth);
        // options.scaleX = x.toFixed(0) / 100;
      }
    }
    if (options.height !== this.props.canvas.height) {
      if (options.height > canvasContent.clientHeight) {
        console.log(options.height);
        options.height = canvasContent.clientHeight;
        // let x =
        //   (100 * (options.width - canvasContent.clientWidth)) / options.width;
        // console.log(options.width, canvasContent.clientWidth);
        // options.scaleX = x.toFixed(0) / 100;
      }
    }

    this.stage.setAttrs(helper.getCanvasConfig(options));

    if (!options.backgroundImage) {
      this.background.backgroundRect.setAttrs({
        width: options.width,
        height: options.height,
        fill: options.fill,
      });
    }

    if (options.backgroundImage) {
      if (this.props.canvas.backgroundImage !== options.backgroundImage) {
        const imageObj = new Image();

        imageObj.onload = () => {
          this.background.backgroundImage.setAttrs({
            width: options.width,
            height: options.height,
            image: imageObj,
          });

          this.background.backgroundImage.show();
          this.background.layer.draw();
        };

        imageObj.src = options.backgroundImage;
      } else {
        this.background.backgroundImage.setAttrs({
          width: options.width,
          height: options.height,
        });

        this.background.layer.draw();
      }
    } else {
      this.background.backgroundImage.hide();
      this.background.layer.draw();
    }
  };

  createElements = (elements, { isAdd }) => {
    elements.forEach((item) => {
      if (item.type === ELEMENT_TYPE.background) {
        const imageObj = new Image();
        const layer = new Konva.Layer();

        layer.on("click", (e) => {
          console.log("background click");
          this.props.handleChangeActiveElement(item.id);
          helper.toggleCanvasEdit(true);

          this.handleDeleteTransformerExcept();
        });

        imageObj.onload = () => {
          const yoda = new Konva.Image({
            x: item.x,
            y: item.y,
            image: imageObj,
            width: item.width,
            height: item.height,
          });

          layer.add(yoda);
          layer.batchDraw();

          this.elementsState.push({
            id: item.id,
            type: item.type,
            layer,
            element: yoda,
          });
        };
        imageObj.src = item.src;
        this.stage.add(layer);
      }
      if (item.type === ELEMENT_TYPE.text) {
        const layer = new Konva.Layer();

        const textNode = new Konva.Text({
          draggable: true,
          x: 0,
          y: 0,
          ...item.style,
        });

        layer.on("mouseover", (evt) => {
          const x = this.elementsState.find((c) => c.id === item.id);

          if (!x) return;

          if (x.transformer.enabledAnchors().length > 0) return;

          x.transformer.enabledAnchors([]);
          x.transformer.show();
          x.layer.draw();
        });
        layer.on("mouseout", (evt) => {
          const x = this.elementsState.find((c) => c.id === item.id);

          if (!x) return;

          if (x.transformer.enabledAnchors().length > 0) return;

          x.transformer.hide();
          x.layer.draw();
          // this.hoverRef.current.style.display = "none";
        });

        if (isAdd) {
          const stageSizes = this.stage.size();
          const nodeSizes = textNode.size();

          textNode.absolutePosition({
            x: stageSizes.width / 2 - nodeSizes.width / 2,
            y: stageSizes.height / 2 - nodeSizes.height / 2,
          });
        }

        textNode.on("mousedown", (e) => {
          // this.hoverRef.current.style.display = "none";
          this.props.handleChangeActiveElement(item.id);
          helper.toggleCanvasEdit(false);

          const searchElement = this.elementsState.find(
            (c) => c.id === item.id
          );

          if (searchElement) {
            searchElement.transformer.enabledAnchors([
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]);
            searchElement.transformer.show();
            searchElement.layer.draw();
          }
          this.handleDeleteTransformerExcept(item.id);
        });

        textNode.on("transform", function () {
          textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            height: textNode.height() * textNode.scaleY(),
            scaleX: 1,
            scaleY: 1,
          });
        });

        layer.add(textNode);

        const tr = new Konva.Transformer({
          rotateEnabled: false,
          enabledAnchors: [],
          node: textNode,
          centeredScaling: false,
        });

        tr.hide();

        layer.add(tr);

        // < Edit Text
        textNode.on("dblclick dbltap", () => {
          // hide text node and transformer:
          textNode.hide();
          tr.hide();
          layer.draw();

          const textarea = helper.createEditableBlock.call(this, textNode);

          textarea.focus();

          function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener("click", handleOutsideClick);
            textNode.show();
            tr.show();
            tr.forceUpdate();
            layer.draw();
          }

          textarea.addEventListener("keydown", function (e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
              textNode.text(textarea.innerText);
              removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
              removeTextarea();
            }
          });

          textarea.addEventListener("keydown", function (e) {
            const scale = textNode.getAbsoluteScale().x;
            textarea.style.width = helper.getTextareaWidth(
              textNode.width() * scale,
              textNode
            );
            textarea.style.height = "auto";
            textarea.style.height =
              textarea.scrollHeight + textNode.fontSize() + "px";
          });

          function handleOutsideClick(e) {
            if (e.target !== textarea) {
              textNode.text(textarea.innerText);
              removeTextarea();
            }
          }
          setTimeout(() => {
            window.addEventListener("click", handleOutsideClick);
          });
        });

        // </ Edit Text

        this.elementsState.push({
          id: item.id,
          type: item.type,
          layer,
          element: textNode,
          transformer: tr,
        });
        layer.draw();
        this.stage.add(layer);

        this.handleDeleteTransformerExcept(item.id);
      }
    });
  };

  componentDidMount() {
    this.init();

    const editCircles = document.querySelectorAll(".editCircle");

    editCircles.forEach((item) => {
      item.onmousedown = (e) => {
        const canvasContent = document.querySelector(".canvasContent");
        const canvasEdit = document.querySelector(".canvasEditWrap");
        const coords = canvasContent.getBoundingClientRect();
        const coordsEdit = canvasEdit.getBoundingClientRect();
        const width = canvasEdit.clientWidth;
        const height = canvasEdit.clientHeight;
        const minWidth = 200;
        const minHeight = 200;

        const styleTop = (canvasContent.clientHeight - height) / 2;
        const styleLeft = (canvasContent.clientWidth - width) / 2;

        document.onmousemove = (e) => {
          let calcWidth = 0;
          let calcHeight = 0;

          if (item.classList.contains("tr")) {
            const { clientX, clientY } = e;

            canvasEdit.style.top = "auto";
            canvasEdit.style.right = "auto";
            canvasEdit.style.bottom = styleTop + "px";
            canvasEdit.style.left = styleLeft + "px";
            canvasEdit.style.transform = "none";

            let posX = clientX > coords.right ? coords.right : clientX;
            let posY = clientY <= coords.top ? coords.top : clientY;

            let newWidth = posX - coordsEdit.left;
            let newHeight = coordsEdit.bottom - posY;

            calcWidth = newWidth <= minWidth ? minWidth : newWidth;
            calcHeight = newHeight <= minHeight ? minHeight : newHeight;
          } else if (item.classList.contains("br")) {
            const { clientX, clientY } = e;

            canvasEdit.style.top = styleTop + "px";
            canvasEdit.style.left = styleLeft + "px";
            canvasEdit.style.bottom = "auto";
            canvasEdit.style.right = "auto";
            canvasEdit.style.transform = "none";

            let posX = clientX > coords.right ? coords.right : clientX;
            let posY = clientY >= coords.bottom ? coords.bottom : clientY;

            let newWidth = posX - coordsEdit.left;
            let newHeight = posY - coordsEdit.top;

            calcWidth = newWidth <= minWidth ? minWidth : newWidth;
            calcHeight = newHeight <= minHeight ? minHeight : newHeight;
          } else if (item.classList.contains("bl")) {
            const { clientX, clientY } = e;

            canvasEdit.style.top = styleTop + "px";
            canvasEdit.style.right = styleLeft + "px";
            canvasEdit.style.left = "auto";
            canvasEdit.style.bottom = "auto";
            canvasEdit.style.transform = "none";

            let posX = clientX <= coords.left ? coords.left : clientX;
            let posY = clientY >= coords.bottom ? coords.bottom : clientY;

            let newWidth = coordsEdit.right - posX;
            let newHeight = posY - coordsEdit.top;

            calcWidth = newWidth <= minWidth ? minWidth : newWidth;
            calcHeight = newHeight <= minHeight ? minHeight : newHeight;
          } else if (item.classList.contains("tl")) {
            const { clientX, clientY } = e;

            canvasEdit.style.bottom = styleTop + "px";
            canvasEdit.style.right = styleLeft + "px";
            canvasEdit.style.left = "auto";
            canvasEdit.style.top = "auto";
            canvasEdit.style.transform = "none";

            let posX = clientX <= coords.left ? coords.left : clientX;
            let posY = clientY <= coords.top ? coords.top : clientY;

            let newWidth = coordsEdit.right - posX;
            let newHeight = coordsEdit.bottom - posY;

            calcWidth = newWidth <= minWidth ? minWidth : newWidth;
            calcHeight = newHeight <= minHeight ? minHeight : newHeight;
          }

          this.props.handleUpdateCanvas({
            ...this.props.canvas,
            width: +parseInt(calcWidth),
            height: +parseInt(calcHeight),
          });

          // this.background.layer.draw();
        };
        document.onmouseup = (e) => {
          document.onmousemove = false;

          canvasEdit.style.inset = "auto";
          canvasEdit.style.bottom = "auto";
          canvasEdit.style.right = "auto";
          canvasEdit.style.top = "50%";
          canvasEdit.style.left = "50%";
          canvasEdit.style.transform = "translate(-50%, -50%)";
        };
      };
    });
  }

  componentWillUpdate(nextProps) {
    const currElements = this.props.elements;
    const nextElements = nextProps.elements;

    // change elements

    if (currElements.length !== nextElements.length) {
      const restElements = helper.getRestArray(currElements, nextElements);
      this.createElements(restElements, { isAdd: true });
    } else {
      currElements.forEach((item) => {
        const nextItem = nextElements.find((x) => x.id === item.id);
        const diffStyles = helper.comparisonStyle(item.style, nextItem.style);
        const elementItem = this.elementsState.find((x) => x.id === item.id);

        if (elementItem && diffStyles) {
          diffStyles.forEach((styleKey) =>
            elementItem.element[styleKey](nextItem.style[styleKey])
          );
          elementItem.layer.draw();
        }
      });
    }

    // change activeId

    const currActiveId = this.props.activeId;
    const nextActiveId = nextProps.activeId;

    if (currActiveId !== nextActiveId && !nextActiveId) {
      console.log(currActiveId, nextActiveId);
      const activeTransformElement = this.elementsState.find(
        (item) => item.id === currActiveId
      );
      if (activeTransformElement) {
        activeTransformElement.transformer.enabledAnchors([]);
        activeTransformElement.transformer.hide();
        activeTransformElement.layer.draw();
      }
    }

    // change canvas

    const currCanvas = this.props.canvas;
    const nextCanvas = nextProps.canvas;

    let z = Object.keys(currCanvas).filter(
      (key) => currCanvas[key] !== nextCanvas[key]
    );

    if (z.length > 0) {
      this.updateCanvas(nextCanvas);
    }
  }

  render() {
    return (
      <div className="canvasWrapper" ref={this.canvasWrapper}>
        <div className="canvasFrame" onClick={this.handleClickFrame}></div>
        <div className="canvasContent">
          <div className="canvasFrame" onClick={this.handleClickFrame}></div>
          <div className="canvasEditWrap">
            <div className="canvas-wrapper" id="canvas"></div>
            <div className="tl editCircle"></div>
            <div className="tr editCircle"></div>
            <div className="bl editCircle"></div>
            <div className="br editCircle"></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ elements, canvas, activeId }) => ({
  elements,
  canvas,
  activeId,
});

const mapDispatch = {
  handleUpdateStyleElement,
  handleChangeActiveElement,
  handleUpdateCanvas,
  handleUpdateStage,
};

export default connect(mapStateToProps, mapDispatch)(Canvas);
