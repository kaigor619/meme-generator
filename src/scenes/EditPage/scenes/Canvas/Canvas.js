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
import Konva from "konva";
import * as helper from "utils/helpers";
import { FONTS } from "types/fonts";
import * as fontHelper from "utils/font";
import EditSize from "./components/EditSize";

import "./Canvas.scss";

const enabledAnchors = ["top-left", "top-right", "bottom-left", "bottom-right"];

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.hoverRef = React.createRef();
    this.canvasWrapper = React.createRef();

    this._deleteTransformersExcept = this._deleteTransformersExcept.bind(this);
    this.addElement = this.addElement.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.updateElement = this.updateElement.bind(this);
  }
  state = {
    editSize: false,
  };
  stage = null;
  background = {
    backgroundRect: null,
    backgroundImage: null,
    backgroundFile: null,
    layer: null,
  };
  elementsState = [];

  canvasNode = createRef(null);
  canvasContent = createRef(null);

  //  Click on frame
  _handleClickFrame = (e) => {
    this._deleteTransformersExcept();
    this.props.handleChangeActiveElement("");
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
  // show transformer by id and delete rest elements
  _showTransformerById(id) {
    const findElement = this.elementsState.find((x) => x.id === id);

    if (findElement) {
      findElement.transformer.enabledAnchors([]);
      findElement.transformer.show();
      findElement.layer.draw();
      this._deleteTransformersExcept(id);
    }
  }

  // add text element
  _addTextElement(element) {
    // const { elements, activeId } = store.getState();
    const layer = new Konva.Layer();

    // textNode
    const textNode = helper.createText(element.style);

    // textNode transformer
    const tr = helper.createTransformer(textNode);

    // layer mouseover
    layer.on("mouseover", () => {
      if (this.props.activeId === element.id) return;
      const findElement = this.elementsState.find((c) => c.id === element.id);
      findElement.transformer.enabledAnchors([]);
      findElement.transformer.show();
      findElement.layer.draw();
    });

    // layer mouseout
    layer.on("mouseout", () => {
      if (this.props.activeId === element.id) return;
      const findElement = this.elementsState.find((c) => c.id === element.id);
      findElement.transformer.hide();
      findElement.layer.draw();
    });

    // textNode mousedown
    textNode.on("mousedown", (e) => {
      this.props.handleChangeActiveElement(element.id);
      // helper.toggleCanvasEdit(false);
      this._deleteTransformersExcept(element.id);

      const searchElement = this.elementsState.find((c) => c.id === element.id);
      if (searchElement) {
        searchElement.transformer.enabledAnchors(enabledAnchors);
        searchElement.transformer.show();
        searchElement.layer.draw();
      }
    });

    // textNode dragend
    textNode.on("dragend", (e) => {
      const { activeId, elements } = this.props;
      const { x, y } = textNode.position();
      const updatedElement = elements.find((x) => x.id === activeId);
      updatedElement.style = { ...updatedElement.style, x, y };
      this.props.handleUpdateElement(updatedElement);
    });

    // textNode transform
    textNode.on("transform", () => {
      const attrs = textNode.getAttrs();
      const { activeId, elements } = this.props;
      const updatedElement = elements.find((x) => x.id === activeId);
      updatedElement.style = { ...updatedElement.style, ...attrs };
      this.props.handleUpdateElement(updatedElement);
    });

    tr.hide();
    layer.add(textNode);
    layer.add(tr);
    layer.draw();
    this.stage.add(layer);

    // textNode editing
    textNode.on("dblclick dbltap", () => {
      const { elements, activeId } = this.props;

      console.log("tap");

      textNode.hide();
      tr.hide();
      layer.draw();

      const textarea = helper.createEditableBlock(
        textNode,
        this.canvasNode.current
      );

      textarea.oninput = (e) => {
        const updatedElement = elements.find((x) => x.id === activeId);
        updatedElement.style.text = e.target.innerText;
        this.props.handleUpdateElement(updatedElement);
      };

      // delete textarea
      function removeTextarea() {
        console.log("remove");
        document.body.removeChild(textarea);
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

        window.addEventListener("click", handleOutsideClick);
      });
    });

    this.elementsState.push({
      id: element.id,
      type: element.type,
      layer,
      element: textNode,
      transformer: tr,
    });

    this._deleteTransformersExcept(element.id);
  }

  // init stage
  _initCanvasBackground = () => {
    const { canvas } = store.getState();
    const layer = new Konva.Layer();
    const { background } = this;

    if (canvas.backgroundImage) {
      helper.createImage(
        { src: canvas.backgroundImage || "", ...canvas },
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
      this._deleteTransformersExcept();
    });

    layer.draw();
    background.backgroundRect = rect;
    background.layer = layer;
    this.stage.add(layer);
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

  // create background image with restrictions
  _createBackgroundImage(backgroundImage, canvas) {
    const { background, canvasContent } = this;

    const { clientHeight, clientWidth } = canvasContent.current;

    helper.createImage({ src: backgroundImage, ...canvas }, (readyImage) => {
      const { width, height } = readyImage.size();

      if (height > clientHeight || width > clientWidth) {
        const kxWidth = width / clientWidth;
        const kxHeight = height / clientHeight;
        const kxBasis = kxWidth > kxHeight ? kxWidth : kxHeight;

        if (kxBasis > 1) {
          let newWidth = width / kxBasis;
          newWidth = newWidth > clientWidth ? clientWidth : newWidth;
          let newHeight = height / kxBasis;
          newHeight = newHeight > clientHeight ? clientHeight : newHeight;

          const updatedCanvas = {
            ...canvas,
            width: newWidth,
            height: newHeight,
          };
          readyImage.size({ width: newWidth, height: newHeight });
          this.stage.setAttrs(helper.getCanvasConfig(updatedCanvas));
          this.props.handleUpdateCanvas(updatedCanvas);
        }
      }

      background.backgroundImage = readyImage;
      background.layer.add(readyImage);
      background.layer.batchDraw();
    });
  }

  // update canvas size
  updateCanvasSize = (width, height) => {
    const { backgroundImage, backgroundRect, layer } = this.background;
    const { canvas } = this.props;

    this.stage.setAttrs({ width, height });

    if (backgroundImage) {
      backgroundImage.setAttrs({ width, height });
    }

    if (backgroundRect) {
      backgroundRect.setAttrs({ width, height });
    }
    layer?.draw();

    const updatedCanvas = {
      ...canvas,
      width,
      height,
    };

    this.props.handleUpdateCanvas(updatedCanvas);
  };
  // update canvas
  updateCanvas = (canvas) => {
    const { width, height, fill, backgroundImage } = canvas;
    const { background } = this;

    this.stage.setAttrs(helper.getCanvasConfig(canvas));

    if (!backgroundImage) {
      background.backgroundRect.setAttrs({ width, height, fill });
      background.backgroundImage?.hide();
      return background.layer.draw();
    }

    if (backgroundImage) {
      let a = background.backgroundImage?.getAttrs().image.src || "";

      if (a !== backgroundImage) {
        this._createBackgroundImage(backgroundImage, canvas);
      } else {
        background.backgroundImage.setAttrs({ width, height });
        background.layer.draw();
      }
    }
  };

  // update element style
  // updateElement = (id, style) => {
  deleteElement = (id) => {
    const index = this.elementsState.findIndex((x) => x.id === id);
    const element = this.elementsState.find((x) => x.id === id);
    element.layer.destroy();
    this.elementsState.splice(index, 1);
  };

  // update element style
  // updateElement = (id, style) => {
  updateElement = (updatedElement) => {
    const element = this.elementsState.find((x) => x.id === updatedElement.id);
    element.element.setAttrs({ ...updatedElement.style });
    element.layer.draw();
  };

  initAPI = () => {
    const { stage, background, elementsState } = this;
    const getAPI = () => ({ stage, background, elementsState });

    this.props.changeCanvasAPI({
      getAPI,
      deleteTransformers: this._deleteTransformersExcept,
      addElement: this.addElement,
      updateCanvas: this.updateCanvas,
      updateElement: this.updateElement,
      updateCanvasSize: this.updateCanvasSize,
      deleteElement: this.deleteElement,
    });
  };

  componentDidMount() {
    this.initStage();
    this._initCanvasBackground();
    this.initAPI();
  }

  componentDidUpdate(prevProps) {
    const { activeId } = this.props;

    if (prevProps.activeId !== activeId) {
      if (activeId) {
        this.setState({ editSize: activeId === "canvas" });

        this._showTransformerById(activeId);
      } else {
        this._deleteTransformersExcept();
        this.setState({ editSize: false });
      }
    }
  }

  render() {
    return (
      <div className="canvasWrapper" ref={this.canvasWrapper}>
        <div className="canvasFrame" onClick={this._handleClickFrame}></div>
        <div className="canvasContent" ref={this.canvasContent}>
          <div className="canvasFrame" onClick={this._handleClickFrame}></div>
          <div className="canvasEditWrap">
            <EditSize active={this.state.editSize} isBackgroundImage={true} />
            <div
              className="canvas-wrapper"
              id="canvas"
              ref={this.canvasNode}
            ></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeId: state.activeId,
  elements: state.elements,
});

const mapDispatch = {
  handleUpdateStyleElement,
  handleChangeActiveElement,
  handleUpdateCanvas,
  handleUpdateStage,
  handleUpdateElement,
};

export default connect(mapStateToProps, mapDispatch)(Canvas);
