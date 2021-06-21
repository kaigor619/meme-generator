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
import store from "store";
import * as konvaService from "services/konva";
import Konva from "konva";
import * as helper from "utils/helpers";
import { FONTS } from "types/fonts";
import * as fontHelper from "utils/font";
import store from "store";

import "./Canvas.scss";

const enabledAnchors = [];

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

  //  Click on frame
  _handleClickFrame = () => {
    this.handleDeleteTransformerExcept();
    this.props.handleChangeActiveElement("");
    // helper.toggleCanvasEdit(false);
  };

  // Delete all transformers except specified id
  _deleteTransformersExcept(id) {
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

  addElement = (element) => {
    const { elements, activeId } = store.getState();

    if (element.type === ELEMENT_TYPE.text) {
      const layer = new Konva.Layer();

      // textNode
      const textNode = helper.createText(item.style);

      // textNode transformer
      const tr = helper.createTransformer(textNode);

      // layer mouseover
      layer.on("mouseover", () => {
        const element = this.elementsState.find((c) => c.id === item.id);
        if (!element || element.transformer.enabledAnchors().length) return;
        element.transformer.enabledAnchors([]);
        element.transformer.show();
        element.layer.draw();
      });

      // layer mouseout
      layer.on("mouseout", () => {
        const element = this.elementsState.find((c) => c.id === item.id);
        if (!element || element.transformer.enabledAnchors().length) return;
        element.transformer.hide();
        element.layer.draw();
      });

      // textNode mousedown
      textNode.on("mousedown", (e) => {
        this.props.handleChangeActiveElement(item.id);
        helper.toggleCanvasEdit(false);
        const searchElement = this.elementsState.find((c) => c.id === item.id);
        this.handleDeleteTransformerExcept(item.id);
        if (searchElement) {
          searchElement.transformer.enabledAnchors(enabledAnchors);
          searchElement.transformer.show();
          searchElement.layer.draw();
        }
      });

      // textNode dragend
      textNode.on("dragend", (e) => {
        const { x, y } = textNode.position();
        const updatedElement = elements.find((x) => x.id === activeId);
        updatedElement.style = { ...updatedElement.style, x, y };
        this.props.handleUpdateElement(updatedElement.id, updatedElement);
      });

      // textNode transform
      textNode.on("transform", function () {
        const { width, height, scaleX, scaleY } = textNode.getAttrs();
        textNode.setAttrs({
          width: width * scaleX,
          height: height * scaleY,
          scaleX: 1,
          scaleY: 1,
        });
      });

      tr.hide();
      layer.add(textNode);
      layer.add(tr);
      layer.draw();
      this.stage.add(layer);

      // textNode editing
      textNode.on("dblclick dbltap", () => {
        textNode.hide();
        tr.hide();
        layer.draw();

        const textarea = helper.createEditableBlock.call(this, textNode);

        textarea.oninput = (e) => {
          const updatedElement = elements.find((x) => x.id === activeId);
          updatedElement.style.text = e.target.innerText;
          this.props.handleUpdateElement(updatedElement.id, updatedElement);
        };

        // delete textarea
        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener("click", handleOutsideClick);
          textNode.show();
          tr.show();
          tr.forceUpdate();
          layer.draw();
        }

        // outside click
        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textNode.text(textarea.innerText);
            removeTextarea();
          }
        }

        // textarea keydown
        textarea.addEventListener("keydown", function (e) {
          // hide on enter & but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.innerText);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });

        // textarea keydown
        textarea.addEventListener("keydown", function (e) {
          const scale = textNode.getAbsoluteScale().x;
          const textWidth = helper.getTextareaWidth(
            textNode.width() * scale,
            textNode
          );

          textarea.style.width = textWidth;
          textarea.style.height = "auto";
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + "px";
        });

        window.addEventListener("click", handleOutsideClick);
      });

      this.elementsState.push({
        id: item.id,
        type: item.type,
        layer,
        element: textNode,
        transformer: tr,
      });

      this.handleDeleteTransformerExcept(item.id);
    }
  };

  init = () => {
    // init api

    const getAPI = () => ({ stage, background, elementsState });

    this.props.changeCanvasAPI({
      getAPI,
    });

    // const { elements, canvas, canvasOptions } = this.props;
    // const { background } = this;
    // const config = helper.getCanvasConfig({ ...canvas, ...canvasOptions });
    // const stage = new Konva.Stage({ ...config });
    // const layer = new Konva.Layer();

    // if (canvas.backgroundImage) {
    //   helper.createImage(
    //     { src: canvas.backgroundImage, ...canvas },
    //     (readyImage) => {
    //       background.backgroundImage = readyImage;
    //       layer.add(readyImage);
    //       layer.batchDraw();
    //     }
    //   );
    // }

    // const rect = helper.createRect(canvas);
    // layer.add(rect);

    // layer.on("click", (e) => {
    //   this.props.handleChangeActiveElement(canvas.id);
    //   helper.toggleCanvasEdit(true);
    //   this.handleDeleteTransformerExcept();
    // });

    // stage.add(layer);
    // layer.draw();

    // this.stage = stage;
    // background.backgroundRect = rect;
    // background.layer = layer;

    // // this.createElements(elements, { isAdd: false });

    // this.props.changeCanvasAPI({
    //   stage,
    //   background,
    //   elementsState,
    // });
  };

  componentDidMount() {
    // this.init();
  }

  render() {
    return (
      <div className="canvasWrapper" ref={this.canvasWrapper}>
        <div className="canvasFrame" onClick={this.handleClickFrame}></div>
        <div className="canvasContent">
          <div className="canvasFrame" onClick={this.handleClickFrame}></div>
          <div className="canvasEditWrap">
            <div className="canvas-wrapper" id="canvas"></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatch = {
  handleUpdateStyleElement,
  handleChangeActiveElement,
  handleUpdateCanvas,
  handleUpdateStage,
  handleUpdateElement,
};

export default connect(null, mapDispatch)(Canvas);
