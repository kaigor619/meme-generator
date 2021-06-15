import React, { useMemo, useState, useEffect } from "react";
import {
  Number,
  Select,
  ButtonsCheck,
  ButtonsSwitch,
  Color,
} from "components/Form";
import SidebarSection from "components/SidebarSection";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { TEXT_OPTIONS_TEMPLATE } from "types/elements";
import { handleUpdateElement, handleDeleteElement } from "reducers";
import * as helper from "utils/helpers";
import { FONTS } from "types/fonts";

import fontSizeIcon from "assets/images/font-size.svg";
import lineHeightIcon from "assets/images/line-height.svg";
import deleteIcon from "assets/images/delete.svg";

import { textAlignOptions, textStyleOptions, fontStyleOptions } from "./data";

import classes from "./TextOptions.module.scss";

const TextOptions = ({
  activeId,
  elements,
  handleUpdateElement,
  handleDeleteElement,
}) => {
  const [textStyle, setTextStyle] = useState(null);

  useEffect(() => {
    if (activeId && elements) {
      const element = elements.find((item) => item.id === activeId);
      element && setTextStyle(element);
    }
  }, [activeId, elements.length]);

  const onChangeStyle = ({ target: { name, value } }) => {
    const modifiedValue = helper.filterStyleValue(name, value);

    const updatedElement = {
      ...textStyle,
      style: { ...textStyle.style, [name]: modifiedValue },
    };

    setTextStyle(updatedElement);
    handleUpdateElement(updatedElement.id, updatedElement);
  };
  const onChangeText = ({ target }) => {
    const updatedElement = { ...textStyle, text: target.value };

    setTextStyle(updatedElement);
    handleUpdateElement(updatedElement.id, updatedElement);
  };

  const handleChangeFontFamily = ({ value, label, url }) => {
    const head = document.querySelector("head");
    const links = document.querySelectorAll("link[data-font]");

    const is = [...links].some(
      (node) => node.getAttribute("data-font") === value
    );

    if (!is) {
      const link = document.createElement("link");
      link.setAttribute("data-font", value);
      link.rel = "stylesheet";
      link.href = url;
      head.appendChild(link);
      link.onload = () => {
        onChangeStyle({ target: { name: "fontFamily", value: label } });
      };
    } else {
      onChangeStyle({ target: { name: "fontFamily", value: label } });
    }
  };

  if (!textStyle) return null;

  return (
    <>
      <SidebarSection title="Text">
        <Form.Control
          name="text"
          as="textarea"
          rows={2}
          onChange={onChangeStyle}
          value={textStyle.style.text || ""}
        />
      </SidebarSection>
      <SidebarSection title="Font">
        <div className={classes.sectionGrid}>
          <Select
            options={fontStyleOptions}
            defaultValue={fontStyleOptions.find(
              (x) => x.label === textStyle.style.fontFamily
            )}
            className={classes.fullRow}
            onChange={handleChangeFontFamily}
          />
          <Number
            name="fontSize"
            icon={fontSizeIcon}
            value={textStyle.style?.fontSize || ""}
            onChange={onChangeStyle}
          />
          <Number
            name="lineHeight"
            icon={lineHeightIcon}
            value={textStyle.style?.lineHeight || ""}
            onChange={onChangeStyle}
          />
          <ButtonsCheck
            activeId={activeId}
            textStyle={textStyle.style}
            onChange={onChangeStyle}
            options={textStyleOptions}
          />
          <ButtonsSwitch
            name="align"
            value={textStyle.style.align}
            options={textAlignOptions}
            onChange={onChangeStyle}
          />
        </div>
      </SidebarSection>

      <SidebarSection title="Fill">
        <div className={classes.sectionGrid}>
          <Color
            name="fill"
            value={textStyle.style.fill}
            className={classes.fullRow}
            onChange={onChangeStyle}
          />
        </div>
      </SidebarSection>

      <div className={classes.btnGroup}>
        <button
          className={classes.btnDelete}
          onClick={() => handleDeleteElement(activeId)}
        >
          <img src={deleteIcon} alt="Delete" />
          <span>Delete</span>
        </button>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  activeId: state.activeId,
  elements: state.elements,
});

const mapDispatch = {
  handleUpdateElement,
  handleDeleteElement,
};

export default connect(mapStateToProps, mapDispatch)(TextOptions);
