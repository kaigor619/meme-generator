import React, { useState, useEffect, useContext } from "react";
import Modal from "components/Modal";
import { useHistory } from "react-router-dom";
import paths from "types/paths";
import Dropzone from "components/Dropzone";
import { connect } from "react-redux";
import { handleUpdateCanvas, handleChangeActiveElement } from "reducers";
import classes from "./AddBackground.module.scss";
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
  handleChangeActiveElement,
}) => {
  const [type, setType] = useState(defaultType || backgroundTypes.localFiles);
  const history = useHistory();
  const { canvasAPI } = useContext(CanvasContext);

  useEffect(() => {
    if (defaultType && defaultType !== type) {
      setType(defaultType);
    }
  }, [defaultType]);

  const handleUpdateFiles = (e) => {
    const img = new Image();
    const url = URL.createObjectURL(e[0]);

    img.onload = function () {
      if (canvasAPI.isReady()) {
        const { width, height } = canvasAPI.updateCanvasSize(
          this.width,
          this.height
        );
        const updatedCanvas = {
          ...canvas,
          backgroundImage: url,
          backgroundFile: e[0],
          width,
          height,
        };
        handleUpdateCanvas(updatedCanvas);
        canvasAPI.updateCanvas(updatedCanvas);
      } else {
        const updatedCanvas = {
          ...canvas,
          backgroundImage: url,
          backgroundFile: e[0],
          width: this.width,
          height: this.height,
        };
        handleUpdateCanvas(updatedCanvas);
        handleChangeActiveElement(canvas.id);
      }

      if (isCreateMeme) history.push(paths.create);
    };
    img.src = url;

    onHide();
  };

  const handleUpdateUrl = (item) => {
    if (isCreateMeme) history.push(paths.create);

    if (canvasAPI.isReady()) {
      const { width, height } = canvasAPI.updateCanvasSize(
        item.width,
        item.height
      );
      const updatedCanvas = {
        ...canvas,
        backgroundImage: item.url,
        backgroundFile: null,
        width,
        height,
      };
      canvasAPI.updateCanvas(updatedCanvas);
      handleUpdateCanvas(updatedCanvas);
    } else {
      const updatedCanvas = {
        ...canvas,
        backgroundImage: item.url,
        backgroundFile: null,
        width: item.width,
        height: item.height,
      };
      handleUpdateCanvas(updatedCanvas);
      handleChangeActiveElement(canvas.id);
    }

    onHide();
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

const mapDispatch = { handleUpdateCanvas, handleChangeActiveElement };

export default connect(mapState, mapDispatch)(AddBackground);
