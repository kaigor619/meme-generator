import React from "react";
import "./Header.scss";

import logo from "assets/images/logo.svg";
import eye from "assets/images/eye.svg";

const Header = () => {
  return (
    <header className="header">
      <div className="header_logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="header_btns">
        <button className="header_preview">
          <img src={eye} alt="Eye" /> Preview
        </button>
        <button className="header_save">Save</button>
        <button className="header_export">Export</button>
      </div>
    </header>
  );
};

export default Header;
