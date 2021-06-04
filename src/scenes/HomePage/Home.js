import React, { useState, useEffect } from "react";
import { Container, Row, Column } from "react-bootstrap";
import DropZone from "react-dropzone";
import { useHistory } from "react-router-dom";
import paths from "types/paths";
import { fetchGetMemes } from "api/memesAPI";
import { ReactComponent as EditIcon } from "assets/images/edit.svg";
import { ReactComponent as DownloadIcon } from "assets/images/download.svg";
import { ReactComponent as ViewIcon } from "assets/images/view.svg";
import AddBackground from "modals/AddBackground";
import { BACKGROUND_TYPES } from "types/constant";
import "./Home.scss";

function App() {
  const [images, setImages] = useState(null);
  const [backgroundModal, setBackgroundModal] = useState(false);
  const [fileType, setFileType] = useState(BACKGROUND_TYPES.localFiles);
  const history = useHistory();

  useEffect(() => {
    fetchGetMemes().then((data) => {
      setImages(data);
    });
  }, []);

  const handleSaveImage = async (item) => {
    fetch(item.url)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      })
      .then((url) => {
        const downloadLink = document.createElement("a");
        downloadLink.download = "meme";
        downloadLink.href = url;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
      });
  };

  const handleEditImage = async (item) => {
    history.push(`${paths.edit}/${item._id}`);
  };

  return (
    <div className="app">
      <Container>
        <Row className="justify-content-center">
          <div className="">
            <div className="text-center mt-5 d-flex align-items-center">
              <img className="smile_icon" src="smile.svg" alt="" />
              <img className="title_icon" src="title.svg" alt="" />
            </div>
            <p className="mt-2 text-center fs-3 header_description">
              Create a meme from JPG, GIF or PNG images. <br /> Edit your image
              and create a meme.
            </p>

            <div className="header_btn_group">
              <button
                className="btn-upload"
                onClick={() => {
                  setFileType(BACKGROUND_TYPES.localFiles);
                  setBackgroundModal(true);
                }}
              >
                <img src="upload_white.svg" alt="" />
                <span>Upload image</span>
              </button>
              <span>or</span>
              <button
                className="btn-choose"
                onClick={() => {
                  setFileType(BACKGROUND_TYPES.search);
                  setBackgroundModal(true);
                }}
              >
                <span>Choose a template</span>
              </button>
            </div>
          </div>
        </Row>
      </Container>
      <div className="memes_slider_wrap">
        <h3 className="memes_slider_title">Our Memes</h3>

        <div className="memes_grid">
          {images?.map((item) => (
            <div key={item._id} className="meme_grid_item">
              <img src={item.url} alt="Meme image" />
              <div className="overlay_wrap">
                <p className="meme_thumbnail_name">Meme</p>

                <div className="meme_action_buttons">
                  <div
                    className="meme_action_btn"
                    onClick={() => handleEditImage(item)}
                  >
                    <EditIcon />
                  </div>
                  <div
                    className="meme_action_btn"
                    onClick={() => handleSaveImage(item)}
                  >
                    <DownloadIcon />
                  </div>
                  <div
                    className="meme_action_btn"
                    onClick={() => {
                      window.open(item.url, "_blank");
                    }}
                  >
                    <ViewIcon />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddBackground
        show={backgroundModal}
        onHide={() => setBackgroundModal(false)}
        defaultType={fileType}
        isCreateMeme
      />
    </div>
  );
}

export default App;
