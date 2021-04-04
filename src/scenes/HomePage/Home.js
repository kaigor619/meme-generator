import React from "react";
import { Container, Row, Column } from "react-bootstrap";
import DropZone from "react-dropzone";
import "./Home.scss";

function App() {
  return (
    <DropZone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <div className="app">
          <Container>
            <Row className="justify-content-center">
              <div className="" {...getRootProps()}>
                <div className="text-center mt-5 d-flex align-items-center">
                  <img className="smile_icon" src="smile.svg" alt="" />
                  <img className="title_icon" src="title.svg" alt="" />
                </div>
                <p className="mt-2 text-center fs-3 header_description">
                  Create a meme from JPG, GIF or PNG images. <br /> Edit your
                  image and create a meme.
                </p>

                <div className="header_btn_group">
                  <input {...getInputProps()} />
                  <button className="btn-upload">
                    <img src="upload_white.svg" alt="" />
                    <span>Upload image</span>
                  </button>
                  <span>or</span>
                  <button className="btn-choose">
                    <span>Choose a template</span>
                  </button>
                </div>
              </div>
            </Row>
          </Container>
        </div>
      )}
    </DropZone>
  );
}

export default App;
