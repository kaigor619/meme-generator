import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { fetchGetMeme } from "api/memesAPI";
import { connect } from "react-redux";
import { handleFillState, handleClearState } from "reducers/index";
import Header from "components/Header";
import Sidebar from "./scenes/Sidebar";
import Canvas from "./scenes/Canvas";
import ToolsBar from "./scenes/ToolsBar";

import classes from "./EditPage.module.scss";

const Edit = ({ isReadyCanvas, handleFillState, handleClearState }) => {
  const { memeId } = useParams();
  const [loading, setLoading] = useState(Boolean(memeId));

  useEffect(() => {
    if (memeId) {
      fetchGetMeme(memeId)
        .then((data) => {
          const { canvas, elements } = data;
          const willUpdate = { canvas, elements };
          handleFillState(willUpdate);
        })
        .catch((err) => console.log(err));
    }

    return handleClearState;
  }, []);

  useEffect(() => {
    if (loading && isReadyCanvas) {
      setLoading(false);
    }
  }, [isReadyCanvas]);

  if (loading)
    return (
      <div className={classes.editPage}>
        <div className={classes.spinnerWrap}>
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );

  return (
    <div className={classes.editPage}>
      <Header />
      <div className={classes.editRow}>
        <div className={classes.toolsBarWrapper}>
          <ToolsBar />
        </div>
        <Canvas />
        <div className={classes.sidebarWrapper}>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => ({
  isReadyCanvas: state.isReadyCanvas,
});

const mapDispatch = {
  handleFillState,
  handleClearState,
};

export default connect(mapState, mapDispatch)(Edit);
