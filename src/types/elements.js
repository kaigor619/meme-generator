import { ELEMENT_TYPE } from "types/constant";

export const TEXT_OPTIONS_TEMPLATE = {
  type: ELEMENT_TYPE.text,
  style: {
    text: "Sample Text",
    fontFamily: "Impact",
    fontStyle: "normal",
    align: "left",
    textDecoration: "",
    fontSize: 40,
    lineHeight: 1,
    fill: "#000",
    shadowColor: "#000",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowOpacity: 1,
    shadowBlur: 10,
    shadowEnabled: false,
  },
};

export const STYLE_TYPES = {
  text: "string",
  fontFamily: "string",
  fontStyle: "string",
  align: "string",
  textDecoration: "string",
  fontSize: "number",
  lineHeight: "number",
  fill: "string",
  shadowColor: "string",
  shadowOffsetX: "number",
  shadowOffsetY: "number",
  shadowOpacity: "number",
  shadowBlur: "number",
  shadowEnabled: "bool",
  width: "number",
  height: "number",
  backgroundColor: "string",
  scaleX: "number",
  scaleY: "number",
};

export const CANVAS_CONFIG = ["width", "height", "container"];
