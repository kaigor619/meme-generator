import alignLeftIcon from "assets/images/align-left.svg";
import alignCenterIcon from "assets/images/align-center.svg";
import alignRightIcon from "assets/images/align-right.svg";
import { FONTS } from "types/fonts";

import classes from "./TextOptions.module.scss";

export const textAlignOptions = [
  {
    value: "left",
    icon: alignLeftIcon,
  },
  {
    value: "center",
    icon: alignCenterIcon,
  },
  {
    value: "right",
    icon: alignRightIcon,
  },
];

export const textStyleOptions = [
  {
    value: "underline",
    option: "textDecoration",
    label: <span className={classes.textStyleUnderline}>T</span>,
  },
  {
    value: "bold",
    option: "fontStyle",
    label: <span className={classes.textStyleBold}>B</span>,
  },
  {
    value: "italic",
    option: "fontStyle",
    label: <span className={classes.textStyleItalic}>I</span>,
  },
];

export const fontStyleOptions = FONTS.map((item) => ({
  value: item.name,
  label: item.label,
  url: item.url,
}));
