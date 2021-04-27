import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeActiveElement } from "reducers";
import "./Header.scss";

import logo from "assets/images/logo.svg";
import eye from "assets/images/eye.svg";

const Header = () => {
  const dispatch = useDispatch();
  const stage = useSelector((state) => state.stage);

  const exportImage = (e) => {
    e.stopPropagation();

    stage.toImage({
      callback(img) {
        console.log(img);
        const link = document.createElement("a");
        link.href = img.src;
        link.download = "canvas-image.jpg";
        document.body.append(link);
        link.click();
      },
      mimeType: "image/jpeg",
      quality: 1,
    });

    console.log(stage);
  };

  return (
    <header
      className="header"
      onClick={() => dispatch(handleChangeActiveElement(""))}
    >
      <div className="header_logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="header_btns">
        <button className="header_preview">
          <img src={eye} alt="Eye" /> Preview
        </button>
        <button className="header_save">Save</button>
        <button className="header_export" onClick={exportImage}>
          Export
        </button>
      </div>
    </header>
  );
};

export default Header;
