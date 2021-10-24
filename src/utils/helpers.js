import {
  STYLE_TYPES,
  CANVAS_CONFIG,
  TEXT_OPTIONS_TEMPLATE,
} from "types/elements";
import { ELEMENT_TYPE } from "types/constant";
import Konva from "konva";
import store from "store";

const getRandomId = () => parseInt(Math.random() * 100000);

export const comparisonStyle = (curr, next) => {
  let diffStyles = [],
    b = false;

  for (let key in curr) {
    b = curr[key] !== next[key];
    if (b) diffStyles.push(key);
  }

  return diffStyles.length ? diffStyles : false;
};

export const getCanvasConfig = (obj) => {
  let config = Object.fromEntries(
    CANVAS_CONFIG.map((item) => [item, obj[item]])
  );

  return config;
};

export const getRestArray = (curr, next) => {
  const restElements =
    curr.length > next.length
      ? curr.filter((item) => !next.some((x) => x.id === item.id))
      : next.filter((item) => !curr.some((x) => x.id === item.id));

  return restElements;
};

export const filterStyleValue = (name, value) => {
  switch (STYLE_TYPES[name]) {
    case "number":
      return parseFloat(value);
    case "string":
      return String(value);
    case "bool":
      return Boolean(value);
    default:
      return value;
  }
};

export const getBoxShadow = (style) => {
  if (style.shadowEnabled) return "none";
  const { shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor } = style;
  return `${shadowOffsetX} ${shadowOffsetY} ${shadowBlur} ${shadowColor}`;
};

export const toPx = (val) => {
  return val + "px";
};
const buildShadowString = (textNode) => {
  const {
    shadowEnabled,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
  } = textNode.getAttrs();

  const shadowString = shadowEnabled
    ? `${shadowOffsetX} ${shadowOffsetY} ${shadowBlur}px ${shadowColor}`
    : "none";

  return shadowString;
};

export function createEditableBlock(textNode, canvasNode) {
  var textPosition = textNode.absolutePosition();

  const canvasCoords = canvasNode.getBoundingClientRect();

  const areaPosition = {
    x: canvasCoords.left + textPosition.x,
    y: canvasCoords.top + textPosition.y,
  };

  const textarea = document.createElement("div");

  const {
    fontSize,
    lineHeight,
    fontFamily,
    fontStyle,
    textDecoration,
    align,
    fill,
    rotation,
  } = textNode.getAttrs();

  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const translateY = isFirefox ? 1 + 2 + Math.round(fontSize / 20) : 1;
  let transform = `translateY(-${translateY})`;
  transform += rotation ? ` rotateZ(${rotation})` : "";

  textarea.setAttribute("contenteditable", true);
  textarea.value = textNode.text();
  textarea.style.position = "fixed";
  textarea.style.top = toPx(areaPosition.y);
  textarea.style.left = toPx(areaPosition.x);
  textarea.style.fontSize = toPx(fontSize);
  textarea.style.padding = toPx(0);
  textarea.style.margin = toPx(0);
  textarea.style.background = "none";
  textarea.style.outline = "none";
  textarea.style.lineHeight = lineHeight;
  textarea.style.fontFamily = fontFamily;
  textarea.style.fontStyle = fontStyle.includes("italic") ? "italic" : "normal";
  textarea.style.fontWeight = fontStyle.includes("bold") ? "bold" : "normal";
  textarea.style.textDecoration = textDecoration;
  textarea.style.transformOrigin = "left top";
  textarea.style.textAlign = align;
  textarea.style.color = fill;
  textarea.style.textShadow = buildShadowString(textNode);
  textarea.innerText = textNode.text();
  textarea.style.transform = transform;
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + toPx(3);
  document.body.appendChild(textarea);
  textarea.focus();

  return textarea;
}

export const getTextareaWidth = (newWidth, textNode) => {
  if (!newWidth) {
    newWidth = textNode.placeholder.length * textNode.fontSize();
  }
  // some extra fixes on different browsers
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const isEdge = document.documentMode || /Edge/.test(navigator.userAgent);

  if (isSafari || isFirefox) {
    newWidth = Math.ceil(newWidth);
  }

  if (isEdge) {
    newWidth += 1;
  }
  return newWidth;
};

export const toggleCanvasEdit = (toggle) => {
  const editCircles = document.querySelectorAll(".editCircle");

  editCircles.forEach((item) => {
    item.style.display = toggle ? "block" : "none";
  });
};

/**
 * Create Konva Image with specific parameters and when is loaded call callback
 * @param { Object } props
 * @param { Function } callback - when img is loaded
 * @returns { Boolean }
 */
export const createImage = (props, callback) => {
  const imageObj = new Image();

  imageObj.onload = () => {
    const konvaImage = new Konva.Image({
      x: props.x || 0,
      y: props.y || 0,
      image: imageObj,
      width: props.width,
      height: props.height,
    });

    callback(konvaImage);
  };
  imageObj.crossOrigin = "Anonymous";
  imageObj.src = props.src;
};

/**
 * Create Konva Rect
 * @param { Object } props
 * @param { Function } callback - when img is loaded
 * @returns { Boolean }
 */
export const createRect = (props) => {
  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: props.width,
    height: props.height,
    fill: props.fill,
  });

  return rect;
};
/**
 * Create Konva Text
 * @param { Object } props
 * @returns { Boolean }
 */
export const createText = (props) => {
  const textNode = new Konva.Text({
    draggable: true,
    ...props,
  });

  return textNode;
};
/**
 * Center textNode
 * @param { Object } props
 * @param { Function } callback - when img is loaded
 * @returns { Boolean }
 */
export const createTransformer = (textNode) => {
  const tr = new Konva.Transformer({
    rotateEnabled: true,
    enabledAnchors: [],
    node: textNode,
    centeredScaling: false,
  });

  return tr;
};
/**
 * add smart text element
 * @param { Object } props
 * @param { Function } callback - when img is loaded
 * @returns { Boolean }
 */
export const addTextElement = () => {
  const { elements } = store.getState();

  const txtElements = elements.filter((x) => x.type === ELEMENT_TYPE.text);

  const base = txtElements.length
    ? txtElements[txtElements.length - 1]
    : TEXT_OPTIONS_TEMPLATE;

  base.style.text = "SAMPLE TEXT";

  const element = {
    ...base,
    style: { ...base.style, x: 0, y: 0 },
    id: getRandomId(),
  };

  return element;
};
/**
 * style top, left, right, bottom
 * @param { Array } array of props
 * @param { Element } element
 */
export const setElementCoords = (element, arr) => {
  const top = arr[0];
  const right = arr[1];
  const bottom = arr[2];
  const left = arr[3];

  element.style.top = top;
  element.style.right = right;
  element.style.bottom = bottom;
  element.style.left = left;

  return element;
};
