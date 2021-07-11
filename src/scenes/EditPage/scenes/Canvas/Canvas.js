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
import { addFonts } from "utils/font";

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
  scale = 1;

  canvasNode = createRef(null);
  canvasContent = createRef(null);
  editRef = createRef(null);

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
        searchElement.transformer.forceUpdate();
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
    textNode.on("dblclick dbltap", (evt) => {
      let count = 0;
      const { elements, activeId } = this.props;

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
        document.body.removeChild(textarea);
        window.removeEventListener("click", handleOutsideClick);
        textNode.show();
        tr.show();
        tr.forceUpdate();
        layer.draw();
      }

      // outside click
      function handleOutsideClick(e) {
        if (count && e.target !== textarea) {
          textNode.text(textarea.innerText);
          removeTextarea();
        }
        count++;
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
    const config = helper.getCanvasConfig({
      ...canvas,
      ...canvasOptions,
    });
    const stage = new Konva.Stage({ ...config, container: "canvas" });

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
  updateCanvasSize = (width, height, isScale) => {
    const { backgroundImage, backgroundRect, layer } = this.background;
    const { canvas } = this.props;
    const canvasNode = this.canvasNode.current;
    const konvaCanvas = document.querySelector(".konvajs-content");

    if (isScale) {
      let { clientHeight, clientWidth } = this.canvasContent.current;
      let scaleW = 1;
      let scaleH = 1;

      if (width > clientWidth) {
        scaleW = (100 * clientWidth) / width / 100;
      }

      if (height > clientHeight) {
        scaleH = (100 * clientHeight) / height / 100;
      }

      let scale = scaleW < scaleH ? scaleW : scaleH;

      scale = Number(scale).toFixed(4);
      this.scale = scale;
      konvaCanvas.style.transform = `scale(${scale})`;

      // width = width > clientWidth ? clientWidth : width;
      // height = height > clientHeight ? clientHeight : height;
    }

    const editRef = this.editRef.current;

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

    const options = konvaCanvas.getBoundingClientRect();

    editRef.style.width = options.width + "px";
    editRef.style.height = options.height + "px";
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

  getDataUrl = () => {
    this._deleteTransformersExcept();
    this.props.handleChangeActiveElement("");

    try {
      const url = this.stage.toDataURL();
      return url;
    } catch (err) {
      console.log(err);
    }
  };

  // update element style
  // updateElement = (id, style) => {
  updateElement = (updatedElement) => {
    const element = this.elementsState.find((x) => x.id === updatedElement.id);
    // Update font family
    if (element.type === ELEMENT_TYPE.text) {
      const newFontFamily = updatedElement.style.fontFamily;
      const prevFontFamily = element.element.fontFamily();
      if (newFontFamily !== prevFontFamily) {
        const font = FONTS.find((x) => x.label === newFontFamily);
        addFonts([font.name], () => {
          element.element.fontFamily(font.label);
          element.transformer.forceUpdate();
          element.layer.draw();

          console.log(element.element.size());
        });
      }
    }

    element.element.setAttrs({ ...updatedElement.style });
    element.layer.draw();
  };

  initAPI = () => {
    const { stage, background, elementsState, scale } = this;
    const getAPI = () => ({ stage, background, elementsState, scale });

    this.props.changeCanvasAPI({
      getAPI,
      deleteTransformers: this._deleteTransformersExcept,
      addElement: this.addElement,
      updateCanvas: this.updateCanvas,
      updateElement: this.updateElement,
      updateCanvasSize: this.updateCanvasSize,
      deleteElement: this.deleteElement,
      getDataUrl: this.getDataUrl,
      getScale: () => this.scale,
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
    if (activeId === "canvas" && !this.state.editSize) {
      this.setState({ editSize: true });
    }
  }

  render() {
    return (
      <div className="canvasWrapper" ref={this.canvasWrapper}>
        <div className="canvasFrame" onClick={this._handleClickFrame}></div>
        <div className="canvasContent" ref={this.canvasContent}>
          <div className="canvasFrame" onClick={this._handleClickFrame}></div>
          <div className="canvasEditWrap" ref={this.editRef}>
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
