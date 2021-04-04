import React, { Component } from "react";
import { ELEMENT_TYPE } from "types/constant";
import { connect } from "react-redux";
import * as konvaService from "services/konva";
import Konva from "konva";

import "./Canvas.scss";

class Canvas extends Component {
  stage = null;

  painting() {
    const { canvas, elements } = this.props;

    elements.forEach((item) => {
      if (item.type === ELEMENT_TYPE.background) {
        const layer = new Konva.Layer();
        this.stage.add(layer);

        const imageObj = new Image();
        imageObj.onload = function () {
          const yoda = new Konva.Image({
            x: item.x,
            y: item.y,
            image: imageObj,
            width: item.width,
            height: item.height,
          });

          layer.add(yoda);
          layer.batchDraw();
        };
        imageObj.src = item.src;
      }
      if (item.type === ELEMENT_TYPE.image) {
        const layer = new Konva.Layer();
        this.stage.add(layer);

        const imageObj = new Image();
        imageObj.onload = function () {
          const yoda = new Konva.Image({
            x: item.x,
            y: item.y,
            image: imageObj,
            width: this.width,
            height: this.height,
          });

          layer.add(yoda);
          layer.batchDraw();
        };
        imageObj.src = item.src;
      }
      if (item.type === ELEMENT_TYPE.text) {
        var layer = new Konva.Layer();
        this.stage.add(layer);

        var textNode = new Konva.Text({
          text: item.text,
          x: 0,
          y: 0,
          draggable: true,
          ...item.style,
        });

        layer.add(textNode);

        layer.draw();
      }
    });
  }

  componentDidMount() {
    const { canvas, elements } = this.props;

    this.stage = new Konva.Stage(canvas);

    this.painting();
  }

  componentDidUpdate() {
    this.painting();
  }
  render() {
    return <div className="canvas-wrapper" id="container"></div>;
  }
}

const mapStateToProps = ({ elements, canvas }) => ({
  elements,
  canvas,
});

export default connect(mapStateToProps)(Canvas);
