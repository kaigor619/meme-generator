import React, { useState, useEffect, useContext } from "react";
import Modal from "components/Modal";
import { useHistory } from "react-router-dom";
import paths from "types/paths";
import Dropzone from "components/Dropzone";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";
import { Nav } from "react-bootstrap";
import classes from "./AddBackground.module.scss";
import { BACKGROUND_TYPES } from "types/constant";
import CanvasContext from "contexts/canvas-context";
import Tabs from "components/Tabs";
import fileIcon from "assets/images/file.svg";
import pictureIcon from "assets/images/pictures.svg";

export const backgroundTypes = {
  search: "memeSearch",
  localFiles: "localFiles",
};

const AddBackground = ({
  show,
  onHide,
  canvas,
  isCreateMeme,
  defaultType,
  memeBackgrounds,
  handleUpdateCanvas,
}) => {
  const [type, setType] = useState(defaultType || backgroundTypes.localFiles);
  const history = useHistory();
  const { canvasAPI } = useContext(CanvasContext);

  return <Modal show={show} onHide={onHide} title="Background"></Modal>;
};

const mapState = (state) => ({
  canvas: state.canvas,
  memeBackgrounds: state.memeBackgrounds,
});

const mapDispatch = { handleUpdateCanvas };

export default connect(mapState, mapDispatch)(AddBackground);
