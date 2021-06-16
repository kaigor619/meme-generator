import { STYLE_TYPES, CANVAS_CONFIG } from "types/elements";

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

export function createEditableBlock(textNode) {
  var textPosition = textNode.absolutePosition();

  const canvasCoords = this.canvasNode.getBoundingClientRect();

  // so position of textarea will be the sum of positions above:
  var areaPosition = {
    x: canvasCoords.left + textPosition.x,
    y: canvasCoords.top + textPosition.y,
  };

  const textarea = document.createElement("div");
  document.body.appendChild(textarea);

  // apply many styles to match text on canvas as close as possible
  // remember that text rendering on canvas and on the textarea can be different
  // and sometimes it is hard to make it 100% the same. But we will try...
  textarea.setAttribute("contenteditable", true);
  textarea.value = textNode.text();
  textarea.style.position = "absolute";
  textarea.style.top = areaPosition.y + "px";
  textarea.style.left = areaPosition.x + "px";
  // textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
  // textarea.style.height = textNode.height() - textNode.padding() * 2 + "px";
  textarea.style.fontSize = textNode.fontSize() + "px";
  textarea.style.padding = "0px";
  textarea.style.margin = "0px";
  textarea.style.background = "none";
  textarea.style.outline = "none";
  textarea.style.lineHeight = textNode.lineHeight();
  textarea.style.fontFamily = textNode.fontFamily();
  textarea.style.fontStyle = textNode.fontStyle().includes("italic")
    ? "italic"
    : "normal";
  textarea.style.fontWeight = textNode.fontStyle().includes("bold")
    ? "bold"
    : "normal";
  textarea.style.textDecoration = textNode.textDecoration();
  textarea.style.transformOrigin = "left top";
  textarea.style.textAlign = textNode.align();
  textarea.style.color = textNode.fill();

  const {
    shadowEnabled,
    shadowBlur,
    shadowColor,
    shadowOffsetX,
    shadowOffsetY,
  } = textNode.getAttrs();

  textarea.style.textShadow = shadowEnabled
    ? `${shadowOffsetX} ${shadowOffsetY} ${shadowBlur}px ${shadowColor}`
    : "none";
  textarea.innerText = textNode.text();

  const rotation = textNode.rotation();
  var transform = "";
  if (rotation) {
    transform += "rotateZ(" + rotation + "deg)";
  }

  var px = 1;
  // also we need to slightly move textarea on firefox
  // because it jumps a bit
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  if (isFirefox) {
    px += 2 + Math.round(textNode.fontSize() / 20);
  }
  transform += "translateY(-" + px + "px)";

  textarea.style.transform = transform;

  // reset height
  textarea.style.height = "auto";
  // after browsers resized it we can set actual value
  textarea.style.height = textarea.scrollHeight + 3 + "px";

  return textarea;
}

export const getTextareaWidth = (newWidth, textNode) => {
  if (!newWidth) {
    // set width for placeholder
    newWidth = textNode.placeholder.length * textNode.fontSize();
  }
  // some extra fixes on different browsers
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  if (isSafari || isFirefox) {
    newWidth = Math.ceil(newWidth);
  }

  var isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
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
