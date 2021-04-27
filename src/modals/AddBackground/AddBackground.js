import React, { useState } from "react";
import Modal from "components/Modal";
import { Tabs, Tab } from "react-bootstrap";
import Dropzone from "components/Dropzone";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";

const AddBackground = ({ show, onHide, canvas, handleUpdateCanvas }) => {
  const [files, setFiles] = useState([]);

  const handleUpdateFiles = (e) => {
    const url = URL.createObjectURL(e[0]);
    handleUpdateCanvas({
      ...canvas,
      backgroundImage: url,
      backgroundFile: e[0],
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} title="Add Background">
      <Dropzone handleUpdateFiles={handleUpdateFiles} />
    </Modal>
  );
};

const mapState = (state) => ({
  canvas: state.canvas,
});

const mapDispatch = { handleUpdateCanvas };

export default connect(mapState, mapDispatch)(AddBackground);
