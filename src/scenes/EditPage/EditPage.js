import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { fetchGetMeme } from "api/memesAPI";
import { connect } from "react-redux";
import {
  handleFillState,
  handleClearState,
  handleChangeActiveElement,
} from "reducers/index";
import Header from "components/Header";
import Sidebar from "./scenes/Sidebar";
import Canvas from "./scenes/Canvas";
import ToolsBar from "./scenes/ToolsBar";
import OfflineError from "components/OfflineError";
import CanvasContext from "contexts/canvas-context";
import classes from "./EditPage.module.scss";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import { useBreakpoints, useCurrentWidth } from "react-breakpoints-hook";
import { Button } from "react-bootstrap";

const Edit = ({
  isReadyCanvas,
  handleFillState,
  handleClearState,
  handleChangeActiveElement,
}) => {
  const { memeId } = useParams();
  const [loading, setLoading] = useState(Boolean(memeId));
  const [error, setError] = useState(false);
  const canvasAPI = useContext(CanvasContext);

  const { xs } = useBreakpoints({
    xs: { min: 0, max: 768 },
  });

  useEffect(() => {
    if (memeId) {
      fetchGetMeme(memeId)
        .then((data) => {
          const { canvas, elements } = data;
          const willUpdate = { canvas, elements };
          handleFillState(willUpdate);
          handleChangeActiveElement(canvas.id);
        })
        .catch((err) => {
          setError(true);
        });
    }

    return handleClearState;
  }, []);

  useEffect(() => {
    if (loading && isReadyCanvas) {
      setLoading(false);
    }
  }, [isReadyCanvas]);

  if (error) return <OfflineError />;

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
        <Canvas {...canvasAPI} isEditMeme={Boolean(memeId)} />

        <Sidebar />
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
  handleChangeActiveElement,
};

export default connect(mapState, mapDispatch)(Edit);
