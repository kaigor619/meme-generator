import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeActiveElement } from "reducers";
import { useHistory } from "react-router-dom";
import axios from "axios";
import store from "store";
import "./Header.scss";
import ExportModal from "modals/Export";

import logo from "assets/images/logo.svg";
import eye from "assets/images/eye.svg";
import paths from "types/paths";

const Header = () => {
  const dispatch = useDispatch();
  const [isExport, setIsExport] = useState(false);
  const history = useHistory();

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
          {/* <button className="header_preview">
            <img src={eye} alt="Eye" /> Preview
          </button>
          <button className="header_save">Save</button> */}
          <button className="header_export" onClick={() => setIsExport(true)}>
            Export
          </button>
        </div>
      </header>

      <ExportModal show={isExport} onHide={() => setIsExport(false)} />
    </>
  );
};

export default Header;
