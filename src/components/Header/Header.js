import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { handleChangeActiveElement } from "reducers";
import { useHistory } from "react-router-dom";
import "./Header.scss";
import ExportModal from "modals/Export";
import CanvasContext from "contexts/canvas-context";
import Lightbox from "react-image-lightbox";

import logo from "assets/images/logo.svg";
import eye from "assets/images/eye.svg";
import paths from "types/paths";

const Header = () => {
  const dispatch = useDispatch();
  const [isExport, setIsExport] = useState(false);
  const [openImage, setOpenImage] = useState("");
  const history = useHistory();
  const { canvasAPI } = useContext(CanvasContext);

  const handlePreviewCanvas = () => {
    const url = canvasAPI.getDataUrl();

    if (url) {
      setOpenImage(url);
    }
  };

  return (
    <>
      <header
        className="header"
        onClick={() => dispatch(handleChangeActiveElement(""))}
      >
        <div className="header_logo" onClick={() => history.push(paths.main)}>
          <img src={logo} alt="Logo" />
        </div>

        <div className="header_btns">
          <button className="header_preview" onClick={handlePreviewCanvas}>
            <img src={eye} alt="Eye" /> Preview
          </button>
          <button className="header_export" onClick={() => setIsExport(true)}>
            Export
          </button>
        </div>
      </header>

      <ExportModal show={isExport} onHide={() => setIsExport(false)} />

      {openImage && (
        <Lightbox mainSrc={openImage} onCloseRequest={() => setOpenImage("")} />
      )}
    </>
  );
};

export default Header;
