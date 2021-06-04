import React, { useState, useEffect } from "react";
import Modal from "components/Modal";
import { useHistory } from "react-router-dom";
import paths from "types/paths";
import Dropzone from "components/Dropzone";
import { connect } from "react-redux";
import { handleUpdateCanvas } from "reducers";
import { Nav } from "react-bootstrap";
import classes from "./AddBackground.module.scss";
import { BACKGROUND_TYPES } from "types/constant";

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
      // alert(this.width + " " + this.height);
      console.log(this.width + " " + this.height);

      handleUpdateCanvas({
        ...canvas,
        width: this.width,
        height: this.height,
        backgroundImage: url,
        backgroundFile: e[0],
      });
      if (isCreateMeme) history.push(paths.create);
    };
    img.src = url;

    onHide();
  };

  const handleUpdateUrl = (item) => {
    handleUpdateCanvas({
      ...canvas,
      width: item.width,
      height: item.height,
      backgroundImage: item.url,
      backgroundFile: null,
    });
    onHide();
    if (isCreateMeme) history.push(paths.create);
  };

  return (
    <Modal show={show} onHide={onHide} title="Background">
      <Nav justify variant="tabs" activeKey={type} className={classes.navWrap}>
        <Nav.Item>
          <Nav.Link
            eventKey={backgroundTypes.localFiles}
            onClick={() => setType(backgroundTypes.localFiles)}
          >
            My files
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey={backgroundTypes.search}
            onClick={() => setType(backgroundTypes.search)}
          >
            Meme search
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {type === "localFiles" && (
        <Dropzone handleUpdateFiles={handleUpdateFiles} />
      )}

      {type === "memeSearch" && (
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
    </Modal>
  );
};

const mapState = (state) => ({
  canvas: state.canvas,
  memeBackgrounds: state.memeBackgrounds,
});

const mapDispatch = { handleUpdateCanvas };

export default connect(mapState, mapDispatch)(AddBackground);
