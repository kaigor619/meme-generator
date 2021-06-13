import React, { useState, useEffect } from "react";
import Modal from "components/Modal";
import { Form, Button } from "react-bootstrap";
import paths from "types/paths";
import Dropzone from "components/Dropzone";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";
import { Nav } from "react-bootstrap";
import classes from "./Export.module.scss";
import { useDispatch, useSelector } from "react-redux";
import store from "store";
import downloadIcon from "assets/images/download1.svg";
import { fetchCreateMeme } from "api/memesAPI";
import { Spinner } from "react-bootstrap";

import { BACKGROUND_TYPES } from "types/constant";

const Export = ({ show, onHide }) => {
  const [name, setName] = useState();
  const [isRequestSave, setIsRequestSave] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const stage = useSelector((state) => state.stage);

  const handleSaveTemplate = async (e) => {
    if (!name) return;
    const { canvas, elements } = store.getState();

    const dataURL = stage.toDataURL();
    const res = await fetch(dataURL);
    const blob = await res.blob();

    const canvas_background_img = canvas.backgroundFile;
    const modifiedCanvas = { ...canvas };
    delete modifiedCanvas.backgroundImage;
    delete modifiedCanvas.backgroundFile;

    const reqData = {
      name,
      canvas: JSON.stringify(modifiedCanvas),
      elements: JSON.stringify(elements),
      canvas_img: blob,
    };

    if (canvas.backgroundFile)
      reqData.canvas_background_img = canvas_background_img;

    const formData = new FormData();

    Object.keys(reqData).forEach((key) => {
      formData.append(key, reqData[key]);
    });

    setIsRequestSave(true);
    fetchCreateMeme(formData)
      .then((res) => {
        setIsRequestSave(false);
        setIsSaved(true);
      })
      .catch((err) => console.log(err));
  };

  const handleDownloadImage = () => {
    const dataURL = stage.toDataURL();

    const downloadLink = document.createElement("a");
    downloadLink.download = name || "meme";
    downloadLink.href = dataURL;
    downloadLink.click();
    downloadLink.remove();
    onHide();
  };

  return (
    <Modal className={classes.modal} show={show} onHide={onHide} title="Export">
      <div className={classes.exportWrap}>
        <Form.Control
          className={classes.memeInput}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="meme name"
          disabled={isRequestSave || isSaved}
        />
        <button
          className={classes.saveTemplate}
          onClick={handleSaveTemplate}
          disabled={isRequestSave || isSaved}
        >
          {isRequestSave ? (
            <Spinner animation="border" variant="light" />
          ) : isSaved ? (
            "Saved"
          ) : (
            "Save as template"
          )}
        </button>
      </div>

      <button className={classes.downloadBtn} onClick={handleDownloadImage}>
        <img src={downloadIcon} alt="" /> <span>Download</span>
      </button>
    </Modal>
  );
};

const mapState = (state) => ({
  canvas: state.canvas,
  memeBackgrounds: state.memeBackgrounds,
});

const mapDispatch = { handleUpdateCanvas };

export default connect(mapState, mapDispatch)(Export);
