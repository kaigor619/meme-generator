import React, { Component, createRef } from "react";
import { ELEMENT_TYPE } from "types/constant";
import { TEXT_OPTIONS_TEMPLATE, CANVAS_CONFIG } from "types/elements";
import { connect } from "react-redux";
import {
  handleUpdateStyleElement,
  handleChangeActiveElement,
  handleUpdateCanvas,
  handleUpdateStage,
  handleUpdateElement,
} from "reducers";
import * as konvaService from "services/konva";
import Konva from "konva";
import * as helper from "utils/helpers";
import { FONTS } from "types/fonts";
import * as fontHelper from "utils/font";

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

  /* Click on frame */
  handleClickFrame = () => {
    this.handleDeleteTransformerExcept();
    this.props.handleChangeActiveElement("");
    helper.toggleCanvasEdit(false);
  };

  // Delete all transformers except specified id
  handleDeleteTransformerExcept(id) {
    this.elementsState
      .filter((item) => item.type !== ELEMENT_TYPE.background)
      .forEach((item) => {
        if (item.id !== id) {
          item.transformer.hide();
          item.transformer.enabledAnchors([]);
          item.layer.draw();
        }
      });
  }

  init = () => {
    const { elements, canvas, canvasOptions } = this.props;
    const { background } = this;
    const config = helper.getCanvasConfig({ ...canvas, ...canvasOptions });
    const stage = new Konva.Stage({ ...config });
    const layer = new Konva.Layer();

    if (canvas.backgroundImage) {
      helper.createImage(
        { src: canvas.backgroundImage, ...canvas },
        (readyImage) => {
          background.backgroundImage = readyImage;
          layer.add(readyImage);
          layer.batchDraw();
        }
      );
    }

    const rect = helper.createRect(canvas);
    layer.add(rect);

    layer.on("click", (e) => {
      this.props.handleChangeActiveElement(canvas.id);
      helper.toggleCanvasEdit(true);
      this.handleDeleteTransformerExcept();
    });

    stage.add(layer);
    layer.draw();

    this.stage = stage;
    background.backgroundRect = rect;
    background.layer = layer;

    this.createElements(elements, { isAdd: false });

    this.props.changeCanvasAPI({
      stage,
      background,
      elementsState,
    });
  };

  updateCanvas = (options) => {
    const { width, height, fill, backgroundImage } = options;
    const { background } = this;

    // const canvasContent = document.querySelector(".canvasContent");
    // if (options.width !== this.props.canvas.width) {
    //   if (options.width > canvasContent.clientWidth) {
    //     options.width = canvasContent.clientWidth;
    //     // let x =
    //     //   (100 * (options.width - canvasContent.clientWidth)) / options.width;
    //     // console.log(options.width, canvasContent.clientWidth);
    //     // options.scaleX = x.toFixed(0) / 100;
    //   }
    // }
    // if (options.height !== this.props.canvas.height) {
    //   if (options.height > canvasContent.clientHeight) {
    //     options.height = canvasContent.clientHeight;
    //     // let x =
    //     //   (100 * (options.width - canvasContent.clientWidth)) / options.width;
    //     // console.log(options.width, canvasContent.clientWidth);
    //     // options.scaleX = x.toFixed(0) / 100;
    //   }
    // }

    this.stage.setAttrs(helper.getCanvasConfig(options));
    if (!backgroundImage) {
      background.backgroundRect.setAttrs({ width, height, fill });
      background.backgroundImage.hide();
      return background.layer.draw();
    }

    if (this.props.canvas.backgroundImage !== backgroundImage) {
      helper.createImage({ src: backgroundImage, ...options }, (image) => {
        background.backgroundImage.setAttrs({ width, height, image });
        background.backgroundImage.show();
        background.layer.draw();
      });
    } else {
      background.backgroundImage.setAttrs({ width, height });
      background.layer.draw();
    }
  };

  createElements = (elements, { isAdd }) => {
    const fontsNames = [];

    elements.forEach((item) => {
      if (item.type === ELEMENT_TYPE.background) {
        const layer = new Konva.Layer();

        layer.on("click", () => {
          this.props.handleChangeActiveElement(item.id);
          helper.toggleCanvasEdit(true);
          this.handleDeleteTransformerExcept();
        });

        helper.createImage(item, (element) => {
          const { id, type } = item;
          layer.add(element);
          layer.batchDraw();
          this.elementsState.push({ id, type, layer, element });
        });

        this.stage.add(layer);
      }
      if (item.type === ELEMENT_TYPE.text) {
        const layer = new Konva.Layer();

        if (!fontsNames.includes(item.style.fontFamily))
          fontsNames.push(item.style.fontFamily);

        const textNode = helper.createText(item.style);

        layer.on("mouseover", () => {
          const element = this.elementsState.find((c) => c.id === item.id);
          if (!element || element.transformer.enabledAnchors().length) return;
          element.transformer.enabledAnchors([]);
          element.transformer.show();
          element.layer.draw();
        });

        layer.on("mouseout", () => {
          const element = this.elementsState.find((c) => c.id === item.id);
          if (!element || element.transformer.enabledAnchors().length) return;
          element.transformer.hide();
          element.layer.draw();
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
        textNode.on("dragend", (e) => {
          const { x, y } = textNode.position();

          const updatedElement = this.props.elements.find(
            (x) => x.id === this.props.activeId
          );
          updatedElement.style = { ...updatedElement.style, x, y };
          this.props.handleUpdateElement(updatedElement.id, updatedElement);
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
          textarea.oninput = (e) => {
            const updatedElement = this.props.elements.find(
              (x) => x.id === this.props.activeId
            );
            updatedElement.style.text = e.target.innerText;
            this.props.handleUpdateElement(updatedElement.id, updatedElement);
          };

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

        console.log(this.stage);
        // this.stage.add(layer);

        this.handleDeleteTransformerExcept(item.id);
      }
    });

    fontHelper.addFonts(fontsNames, () => {
      this.elementsState
        .filter(
          (item) =>
            item.type === ELEMENT_TYPE.text &&
            fontsNames.includes(item.element.attrs.fontFamily)
        )
        .forEach((item) => {
          item.layer.draw();
        });
    });
  };

  componentDidMount() {
    this.init();

    // const editCircles = document.querySelectorAll(".editCircle");

    // editCircles.forEach((item) => {
    //   item.onmousedown = (e) => {
    //     const canvasContent = document.querySelector(".canvasContent");
    //     const canvasEdit = document.querySelector(".canvasEditWrap");
    //     const coords = canvasContent.getBoundingClientRect();
    //     const coordsEdit = canvasEdit.getBoundingClientRect();
    //     const width = canvasEdit.clientWidth;
    //     const height = canvasEdit.clientHeight;
    //     const minWidth = 200;
    //     const minHeight = 200;

    //     const styleTop = (canvasContent.clientHeight - height) / 2;
    //     const styleLeft = (canvasContent.clientWidth - width) / 2;

    //     document.onmousemove = (e) => {
    //       let calcWidth = 0;
    //       let calcHeight = 0;

    //       if (item.classList.contains("tr")) {
    //         const { clientX, clientY } = e;

    //         canvasEdit.style.top = "auto";
    //         canvasEdit.style.right = "auto";
    //         canvasEdit.style.bottom = styleTop + "px";
    //         canvasEdit.style.left = styleLeft + "px";
    //         canvasEdit.style.transform = "none";

    //         let posX = clientX > coords.right ? coords.right : clientX;
    //         let posY = clientY <= coords.top ? coords.top : clientY;

    //         let newWidth = posX - coordsEdit.left;
    //         let newHeight = coordsEdit.bottom - posY;

    //         calcWidth = newWidth <= minWidth ? minWidth : newWidth;
    //         calcHeight = newHeight <= minHeight ? minHeight : newHeight;
    //       } else if (item.classList.contains("br")) {
    //         const { clientX, clientY } = e;

    //         canvasEdit.style.top = styleTop + "px";
    //         canvasEdit.style.left = styleLeft + "px";
    //         canvasEdit.style.bottom = "auto";
    //         canvasEdit.style.right = "auto";
    //         canvasEdit.style.transform = "none";

    //         let posX = clientX > coords.right ? coords.right : clientX;
    //         let posY = clientY >= coords.bottom ? coords.bottom : clientY;

    //         let newWidth = posX - coordsEdit.left;
    //         let newHeight = posY - coordsEdit.top;

    //         calcWidth = newWidth <= minWidth ? minWidth : newWidth;
    //         calcHeight = newHeight <= minHeight ? minHeight : newHeight;
    //       } else if (item.classList.contains("bl")) {
    //         const { clientX, clientY } = e;

    //         canvasEdit.style.top = styleTop + "px";
    //         canvasEdit.style.right = styleLeft + "px";
    //         canvasEdit.style.left = "auto";
    //         canvasEdit.style.bottom = "auto";
    //         canvasEdit.style.transform = "none";

    //         let posX = clientX <= coords.left ? coords.left : clientX;
    //         let posY = clientY >= coords.bottom ? coords.bottom : clientY;

    //         let newWidth = coordsEdit.right - posX;
    //         let newHeight = posY - coordsEdit.top;

    //         calcWidth = newWidth <= minWidth ? minWidth : newWidth;
    //         calcHeight = newHeight <= minHeight ? minHeight : newHeight;
    //       } else if (item.classList.contains("tl")) {
    //         const { clientX, clientY } = e;

    //         canvasEdit.style.bottom = styleTop + "px";
    //         canvasEdit.style.right = styleLeft + "px";
    //         canvasEdit.style.left = "auto";
    //         canvasEdit.style.top = "auto";
    //         canvasEdit.style.transform = "none";

    //         let posX = clientX <= coords.left ? coords.left : clientX;
    //         let posY = clientY <= coords.top ? coords.top : clientY;

    //         let newWidth = coordsEdit.right - posX;
    //         let newHeight = coordsEdit.bottom - posY;

    //         calcWidth = newWidth <= minWidth ? minWidth : newWidth;
    //         calcHeight = newHeight <= minHeight ? minHeight : newHeight;
    //       }

    //       this.props.handleUpdateCanvas({
    //         ...this.props.canvas,
    //         width: +parseInt(calcWidth),
    //         height: +parseInt(calcHeight),
    //       });

    //       // this.background.layer.draw();
    //     };
    //     document.onmouseup = (e) => {
    //       document.onmousemove = false;

    //       canvasEdit.style.inset = "auto";
    //       canvasEdit.style.bottom = "auto";
    //       canvasEdit.style.right = "auto";
    //       canvasEdit.style.top = "50%";
    //       canvasEdit.style.left = "50%";
    //       canvasEdit.style.transform = "translate(-50%, -50%)";
    //     };
    //   };
    // });
  }

  // componentWillUpdate(nextProps) {
  //   const currElements = this.props.elements;
  //   const nextElements = nextProps.elements;

  //   // change elements

  //   if (currElements.length !== nextElements.length) {
  //     const restElements = helper.getRestArray(currElements, nextElements);

  //     if (currElements.length > nextElements.length) {
  //       this.props.handleChangeActiveElement();
  //       this.handleDeleteTransformerExcept();
  //       restElements.forEach((x) => {
  //         let p = this.elementsState.find((z) => z.id === x.id);
  //         p.transformer.detach();
  //         p.layer.destroy();
  //         this.elementsState = this.elementsState.filter((a) => a.id !== x.id);
  //       });
  //     } else {
  //       this.createElements(restElements, { isAdd: true });
  //     }
  //   } else {
  //     currElements.forEach((item) => {
  //       const nextItem = nextElements.find((x) => x.id === item.id);
  //       const diffStyles = helper.comparisonStyle(item.style, nextItem.style);
  //       const elementItem = this.elementsState.find((x) => x.id === item.id);

  //       if (elementItem && diffStyles) {
  //         diffStyles.forEach((styleKey) =>
  //           elementItem.element[styleKey](nextItem.style[styleKey])
  //         );
  //         elementItem.layer.draw();
  //       }
  //     });
  //   }

  //   // change activeId

  //   const currActiveId = this.props.activeId;
  //   const nextActiveId = nextProps.activeId;

  //   if (currActiveId !== nextActiveId && !nextActiveId) {
  //     const activeTransformElement = this.elementsState.find(
  //       (item) => item.id === currActiveId
  //     );
  //     if (activeTransformElement?.transformer) {
  //       activeTransformElement.transformer.enabledAnchors([]);
  //       activeTransformElement.transformer.hide();
  //       activeTransformElement.layer.draw();
  //     }
  //   }

  //   // change canvas

  //   const currCanvas = this.props.canvas;
  //   const nextCanvas = nextProps.canvas;

  //   let z = Object.keys(currCanvas).filter(
  //     (key) => currCanvas[key] !== nextCanvas[key]
  //   );

  //   if (z.length > 0) {
  //     this.updateCanvas(nextCanvas);
  //   }
  // }

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

const mapStateToProps = ({ elements, canvas, canvasOptions, activeId }) => ({
  elements,
  canvas,
  canvasOptions,
  activeId,
});

const mapDispatch = {
  handleUpdateStyleElement,
  handleChangeActiveElement,
  handleUpdateCanvas,
  handleUpdateStage,
  handleUpdateElement,
};

export default connect(mapStateToProps, mapDispatch)(Canvas);
