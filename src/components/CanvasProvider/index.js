import React, { useState } from "react";
import CanvasContext from "contexts/canvas-context";
import { initialAPI } from "types/canvas";

const CanvasProvider = ({ children }) => {
  const [canvasAPI, setCanvasAPI] = useState(initialAPI);

  const changeCanvasAPI = (newApi) => {
    setCanvasAPI(newApi);
  };

  const addCanvasItemAPI = (name, value) => {
    setCanvasAPI((state) => ({ ...state, [name]: value }));
  };

  const removeCanvasItemAPI = (name) => {
    const copyCanvasAPI = { ...canvasAPI };
    if (name in copyCanvasAPI) {
      delete copyCanvasAPI[name];
      setCanvasAPI(copyCanvasAPI);
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasAPI,
        changeCanvasAPI,
        addCanvasItemAPI,
        removeCanvasItemAPI,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
