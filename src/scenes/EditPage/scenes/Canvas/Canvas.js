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
    backgroundFile: null,
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

  // add text element
  _addTextElement(element) {
    const { elements, activeId } = store.getState();
    const layer = new Konva.Layer();

    // textNode
    const textNode = helper.createText(element.style);

    // textNode transformer
    const tr = helper.createTransformer(textNode);

    // layer mouseover
    layer.on("mouseover", () => {
      const element = this.elementsState.find((c) => c.id === element.id);
      if (!element || element.transformer.enabledAnchors().length) return;
      element.transformer.enabledAnchors([]);
      element.transformer.show();
      element.layer.draw();
    });

    // layer mouseout
    layer.on("mouseout", () => {
      const element = this.elementsState.find((c) => c.id === element.id);
      if (!element || element.transformer.enabledAnchors().length) return;
      element.transformer.hide();
      element.layer.draw();
    });

    // textNode mousedown
    textNode.on("mousedown", (e) => {
      this.props.handleChangeActiveElement(element.id);
      helper.toggleCanvasEdit(false);
      const searchElement = this.elementsState.find((c) => c.id === element.id);
      this.handleDeleteTransformerExcept(element.id);
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
      id: element.id,
      type: element.type,
      layer,
      element: textNode,
      transformer: tr,
    });

    this.handleDeleteTransformerExcept(element.id);
  }

  // init stage
  _initCanvasBackground = () => {
    const { canvas } = store.getState();
    const layer = new Konva.Layer();
    const { background } = this;

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
      // helper.toggleCanvasEdit(true);
      this._handleDeleteTransformerExcept();
    });

    layer.draw();
    background.backgroundRect = rect;
    background.layer = layer;
    this.stage.add(layer);
  };

  _initAPI = () => {
    const getAPI = () => ({ stage, background, elementsState });
    this.props.changeCanvasAPI({
      getAPI,
    });
  };

  // init stage
  initStage() {
    const { canvas, canvasOptions } = store.getState();
    const config = helper.getCanvasConfig({ ...canvas, ...canvasOptions });
    const stage = new Konva.Stage({ ...config });

    this.stage = stage;
  }

  addElement = (element) => {
    if (element.type === ELEMENT_TYPE.text) {
      this._addTextElement(element);
    }
  };

  // update canvas
  updateCanvas = (options) => {
    const store = store.getState().canvas;
    const { width, height, fill, backgroundImage } = options;
    const { background } = this;

    this.stage.setAttrs(helper.getCanvasConfig(options));
    if (!backgroundImage) {
      background.backgroundRect.setAttrs({ width, height, fill });
      background.backgroundImage.hide();
      return background.layer.draw();
    }

    if (this.background.backgroundImage !== backgroundImage) {
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
  // update element style
  updateElement = (id, style) => {};

  componentDidMount() {
    this.initStage();
    this._initAPI();
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
