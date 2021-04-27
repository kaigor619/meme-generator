/* eslint-disable no-restricted-syntax */
import React, { useRef, useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import uploadIcon from "assets/images/upload.svg";
import classes from "./Dropzone.module.scss";

const MyDropzone = ({ handleUpdateFiles }) => {
  const onDrop = (acceptedFiles) => {
    handleUpdateFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        <div className={classes.dropWrap}>
          <div className={classes.dropContent}>
            <img src={uploadIcon} alt="Upload Icon" />
            <p>
              Click to upload, <br /> or drag and drop file here.
            </p>
          </div>
        </div>
      }
    </div>
  );
};

export default MyDropzone;
