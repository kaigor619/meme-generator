import React, { useMemo } from "react";
import {
  Number,
  Select,
  ButtonsCheck,
  ButtonsSwitch,
  Color,
} from "components/Form";
import SidebarSection from "components/SidebarSection";
import { Form } from "react-bootstrap";

import fontSizeIcon from "assets/images/font-size.svg";
import lineHeightIcon from "assets/images/line-height.svg";
import alignLeftIcon from "assets/images/align-left.svg";
import alignCenterIcon from "assets/images/align-center.svg";
import alignRightIcon from "assets/images/align-right.svg";

import classes from "./TextOptions.module.scss";

const TextOptions = () => {
  const textStyleOptions = useMemo(
    () => [
      {
        name: "underline",
        value: <span className={classes.textStyleUnderline}>T</span>,
      },
      {
        name: "bold",
        value: <span className={classes.textStyleBold}>B</span>,
      },
      {
        name: "italic",
        value: <span className={classes.textStyleItalic}>I</span>,
      },
    ],
    [classes]
  );
  const textAlignOptions = useMemo(
    () => [
      {
        name: "left",
        value: <img src={alignLeftIcon} alt="" />,
      },
      {
        name: "center",
        value: <img src={alignCenterIcon} alt="" />,
      },
      {
        name: "right",
        value: <img src={alignRightIcon} alt="" />,
      },
    ],
    [classes]
  );

  return (
    <>
      <SidebarSection title="Text">
        <Form.Control type="text" value="This is text" />
      </SidebarSection>
      <SidebarSection title="Font">
        <div className={classes.sectionGrid}>
          <Select className={classes.fullRow} />
          <Number icon={fontSizeIcon} value="1" />
          <Number icon={lineHeightIcon} value="1" />

          <ButtonsCheck options={textStyleOptions} />
          <ButtonsSwitch options={textAlignOptions} />
        </div>
      </SidebarSection>

      <SidebarSection title="Fill">
        <div className={classes.sectionGrid}>
          <Color value="A78B28" />
        </div>
      </SidebarSection>
    </>
  );
};

export default TextOptions;
