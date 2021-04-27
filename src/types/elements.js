import { ELEMENT_TYPE } from "types/constant";

export const TEXT_OPTIONS_TEMPLATE = {
  type: ELEMENT_TYPE.text,
  style: {
    text: "Text",
    fontFamily: "Impact",
    fontStyle: "bold",
    align: "left",
    textDecoration: "",
    fontSize: 40,
    lineHeight: 1,
    fill: "#fff",
    shadowColor: "#000",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowOpacity: 1,
    shadowBlur: 10,
    shadowEnabled: true,
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
};

export const CANVAS_CONFIG = ["container", "width", "height"];
