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
  const [files, setFiles] = useState([]);
  const [type, setType] = useState(defaultType || backgroundTypes.localFiles);
  const history = useHistory();
  const { canvasAPI } = useContext(CanvasContext);

  useEffect(() => {
    if (defaultType && defaultType !== type) {
      setType(defaultType);
    }
  }, [defaultType]);

  const handleUpdateFiles = (e) => {
    console.log(e[0]);
    const img = new Image();
    const url = URL.createObjectURL(e[0]);

    img.onload = function () {
      const updatedCanvas = {
        ...canvas,
        width: this.width,
        height: this.height,
        backgroundImage: url,
        backgroundFile: e[0],
      };

      canvasAPI.updateCanvas(updatedCanvas);
      handleUpdateCanvas(updatedCanvas);
      if (isCreateMeme) history.push(paths.create);
    };
    img.src = url;

    onHide();
  };

  const handleUpdateUrl = (item) => {
    const updatedCanvas = {
      ...canvas,
      width: item.width,
      height: item.height,
      backgroundImage: item.url,
      backgroundFile: null,
    };

    canvasAPI.updateCanvas(updatedCanvas);
    handleUpdateCanvas(updatedCanvas);
    onHide();
    if (isCreateMeme) history.push(paths.create);
  };

  return (
    <Modal show={show} onHide={onHide} title="Background">
      <Tabs
        items={[
          { to: backgroundTypes.localFiles, name: "My files", icon: fileIcon },
          {
            to: backgroundTypes.search,
            name: "Templates",
            icon: pictureIcon,
          },
        ]}
        selected={type}
        onChange={(x) => setType(x)}
      />

      <div className={classes.tabsContent}>
        {type === backgroundTypes.localFiles && (
          <div className={classes.dropzoneWrap}>
            <Dropzone handleUpdateFiles={handleUpdateFiles} />
          </div>
        )}

        {type === backgroundTypes.search && (
          <div className={classes.memeSearch}>
            {memeBackgrounds.map((item) => (
              <div
                className={classes.memeItem}
                key={item.id}
                onClick={() => handleUpdateUrl(item)}
              >
                <img src={item.url} alt="Meme background" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

const mapState = (state) => ({
  canvas: state.canvas,
  memeBackgrounds: state.memeBackgrounds,
});

const mapDispatch = { handleUpdateCanvas };

export default connect(mapState, mapDispatch)(AddBackground);
