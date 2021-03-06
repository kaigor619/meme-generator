import React, { useState, useEffect, useMemo } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import paths from "types/paths";
import { fetchGetMemes } from "api/memesAPI";
import { ReactComponent as EditIcon } from "assets/images/edit.svg";
import { ReactComponent as DownloadIcon } from "assets/images/download.svg";
import { ReactComponent as ViewIcon } from "assets/images/view.svg";
import AddBackground from "modals/AddBackground";
import { BACKGROUND_TYPES } from "types/constant";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "./Home.scss";
import Slider from "react-slick";
import { useBreakpoints } from "react-breakpoints-hook";

function App() {
  const [images, setImages] = useState(null);
  const [backgroundModal, setBackgroundModal] = useState(false);
  const [openImage, setOpenImage] = useState("");
  const [fileType, setFileType] = useState(BACKGROUND_TYPES.localFiles);
  const history = useHistory();
  const { xs, sm, md } = useBreakpoints({
    xs: { min: 0, max: 600 },
    sm: { min: 601, max: 960 },
    md: { min: 961, max: 1400 },
    lg: { min: 1401, max: null },
  });

  const sliderSettings = useMemo(() => {
    let slidesToShow = 5;
    let slidesToScroll = 2;
    if (md) slidesToShow = 4;
    if (sm) {
      slidesToShow = 3;
      slidesToScroll = 1;
    }

    if (xs) {
      slidesToScroll = 1;
      slidesToShow = 1;
    }

    return {
      dots: false,
      infinite: true,
      arrows: true,
      speed: 500,
      slidesToShow,
      slidesToScroll,
      vertical: false,
    };
  }, [xs, sm, md]);

  useEffect(() => {
    fetchGetMemes().then((data) => {
      setImages(data);
    });
  }, []);

  const handleSaveImage = async (e, item) => {
    e.stopPropagation();
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

  const handleClickCard = (e, url) => {
    e.stopPropagation();
    setOpenImage(url);
  };

  return (
    <div className="app">
      <Container>
        <Row className="justify-content-center">
          <div className="">
            <div className="text-center mt-5">
              <img className="title_icon" src="title.svg" alt="" />
            </div>
            <p className="text-center fs-3 header_description">
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
                <span>Choose template</span>
              </button>
            </div>
          </div>
        </Row>
      </Container>
      <div className="memes_slider_wrap">
        <h3 className="memes_slider_title">Our Memes</h3>
      </div>

      <AddBackground
        show={backgroundModal}
        onHide={() => setBackgroundModal(false)}
        defaultType={fileType}
        isCreateMeme
      />

      {openImage && (
        <Lightbox mainSrc={openImage} onCloseRequest={() => setOpenImage("")} />
      )}

      <div className="sliderWrap">
        <Slider {...sliderSettings}>
          {images?.map((item) => (
            <div key={item._id} className="meme_grid_item_wrap">
              <div className="meme_grid_item">
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
                      onClick={(e) => handleSaveImage(e, item)}
                    >
                      <DownloadIcon />
                    </div>
                    <div
                      className="meme_action_btn"
                      onClick={(e) => handleClickCard(e, item.url)}
                    >
                      <ViewIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default App;
