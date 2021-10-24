import React, { useContext, useState, useEffect, useMemo } from "react";
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
import {
  handleUpdateElement,
  handleDeleteElement,
  handleChangeActiveElement,
} from "reducers";
import * as helper from "utils/helpers";
import CanvasContext from "contexts/canvas-context";
import RangeSlider from "react-bootstrap-range-slider";
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
  handleChangeActiveElement,
}) => {
  const { canvasAPI } = useContext(CanvasContext);

  const textStyle = useMemo(() => {
    const element = elements.find((item) => item.id === activeId);

    return element?.style || {};
  }, [activeId, elements]);

  const onChangeStyle = ({ target: { name, value } }) => {
    const readyValue = helper.filterStyleValue(name, value);

    const findElement = elements.find((x) => x.id === activeId);
    const updatedElement = {
      ...findElement,
      style: { ...textStyle, [name]: readyValue },
    };

    canvasAPI.updateElement(updatedElement);
    handleUpdateElement(updatedElement);
  };

  const handleChangeFontFamily = ({ value, label, url }) => {
    onChangeStyle({ target: { name: "fontFamily", value: label } });
  };
  const handleRemoveElement = () => {
    handleChangeActiveElement("");
    canvasAPI.deleteElement(activeId);
    handleDeleteElement(activeId);
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
          value={textStyle.text || ""}
        />
      </SidebarSection>
      <SidebarSection title="Font">
        <div className={classes.sectionGrid}>
          <Select
            options={fontStyleOptions}
            defaultValue={fontStyleOptions.find(
              (x) => x.label === textStyle.fontFamily
            )}
            className={classes.fullRow}
            onChange={handleChangeFontFamily}
          />
          <Number
            name="fontSize"
            icon={fontSizeIcon}
            value={textStyle.fontSize || ""}
            onChange={onChangeStyle}
          />
          <Number
            name="lineHeight"
            icon={lineHeightIcon}
            value={textStyle.lineHeight || ""}
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
            value={textStyle.align}
            options={textAlignOptions}
            onChange={onChangeStyle}
          />
        </div>
      </SidebarSection>

      <SidebarSection title="Fill">
        <div className={classes.sectionGrid}>
          <Color
            name="fill"
            value={textStyle.fill}
            className={classes.fullRow}
            onChange={onChangeStyle}
          />
        </div>
      </SidebarSection>

      <SidebarSection title="Shadow">
        <div className={classes.sectionGrid}>
          <div className={classes.shadowSection}>
            <label className={classes.shadowLabel}>
              <input
                name="shadowEnabled"
                onChange={(e) => {
                  onChangeStyle({
                    target: { name: e.target.name, value: e.target.checked },
                  });
                }}
                checked={Boolean(textStyle.shadowEnabled)}
                type="checkbox"
              />
              <span>Enable</span>
            </label>
            <RangeSlider
              name="shadowBlur"
              value={textStyle.shadowBlur}
              onChange={(e) =>
                onChangeStyle({
                  target: { name: "shadowBlur", value: e.target.value },
                })
              }
            />
          </div>
          <Color
            name="shadowColor"
            value={textStyle.shadowColor}
            className={classes.fullRow}
            onChange={onChangeStyle}
          />
        </div>
      </SidebarSection>

      <div className={classes.btnGroup}>
        <button className={classes.btnDelete} onClick={handleRemoveElement}>
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
  handleChangeActiveElement,
};

export default connect(mapStateToProps, mapDispatch)(TextOptions);
