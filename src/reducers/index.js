import { ELEMENT_TYPE } from "types/constant";
import { TEXT_OPTIONS_TEMPLATE } from "types/elements";

import canvasBackground from "assets/images/canvas-background.jpg";

export const types = {
  CHANGE_ACTIVE_ELEMENT: "CHANGE_ACTIVE_ELEMENT",
  ADD_ELEMENT: "ADD_ELEMENT",
  DELETE_ELEMENT: "DELETE_ELEMENT",
  UPDATE_ELEMENT: "UPDATE_ELEMENT",
  UPDATE_CANVAS: "UPDATE_CANVAS",
  CHANGE_MODAL_ID: "CHANGE_MODAL_ID",
  UPDATE_STAGE: "UPDATE_STAGE",
  UPDATE_STATE: "UPDATE_STATE",
  GET_BACKGROUNDS: "GET_BACKGROUNDS",
  CLEAR_STATE: "CLEAR_STATE",
};

const initialState = {
  activeId: "canvas",
  stage: null,
  modalId: "",
  isReadyCanvas: false,
  canvasOptions: {
    id: "canvas",
    container: "canvas",
    backgroundImage: "",
    backgroundFile: null,
  },
  canvas: {
    width: 500,
    height: 400,
    fill: "#fff",
    id: "canvas",
    container: "canvas",
    backgroundImage: "",
    backgroundFile: null,
  },
  elements: [],
  memeBackgrounds: [],
};

export const handleDeleteElement = (id) => {
  return {
    type: types.DELETE_ELEMENT,
    id,
  };
};
export const handleFillState = (obj) => {
  return {
    type: types.UPDATE_STATE,
    data: obj,
  };
};

export const handleUpdateStage = (stage) => {
  return {
    type: types.UPDATE_STAGE,
    data: stage,
  };
};

export const handleChangeModalId = (id) => {
  return {
    type: types.CHANGE_MODAL_ID,
    data: id,
  };
};

export const handleChangeActiveElement = (id) => {
  return {
    type: types.CHANGE_ACTIVE_ELEMENT,
    data: id,
  };
};

export const handleAddElement = () => (dispatch) => {
  const id = Date.now().toString();

  dispatch({
    type: types.ADD_ELEMENT,
    data: { id, ...TEXT_OPTIONS_TEMPLATE },
  });
};

export const handleUpdateStyleElement = (id, data) => (dispatch, getState) => {
  const { elements } = getState();

  const element = elements.find((item) => item.id === id);

  if (!element) return;

  dispatch({
    type: types.UPDATE_ELEMENT,
    data: { ...element, style: { ...element.style, ...data } },
  });
};

export const handleUpdateElement = (id, data) => (dispatch, getState) => {
  dispatch({
    type: types.UPDATE_ELEMENT,
    data: { id, ...data },
  });
};
export const handleUpdateCanvas = (data) => (dispatch, getState) => {
  dispatch({
    type: types.UPDATE_CANVAS,
    data: data,
  });
};
export const handleClearState = () => (dispatch, getState) => {
  dispatch({
    type: types.CLEAR_STATE,
    data: initialState,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_ELEMENT: {
      return {
        ...state,
        elements: [...state.elements, action.data],
      };
    }
    case types.CLEAR_STATE: {
      return action.data;
    }
    case types.DELETE_ELEMENT: {
      return {
        ...state,
        elements: state.elements.filter((item) => item.id !== action.id),
      };
    }
    case types.UPDATE_ELEMENT: {
      return {
        ...state,
        elements: [
          ...state.elements.filter((item) => item.id !== action.data.id),
          action.data,
        ],
      };
    }
    case types.CHANGE_ACTIVE_ELEMENT: {
      return {
        ...state,
        activeId: action.data,
      };
    }
    case types.UPDATE_CANVAS: {
      return {
        ...state,
        canvas: action.data,
      };
    }
    case types.CHANGE_MODAL_ID: {
      return {
        ...state,
        modalId: action.data,
      };
    }
    case types.UPDATE_STAGE: {
      return {
        ...state,
        stage: action.data,
      };
    }
    case types.UPDATE_STATE: {
      return {
        ...state,
        ...action.data,
        isReadyCanvas: true,
      };
    }
    case types.GET_BACKGROUNDS: {
      return {
        ...state,
        memeBackgrounds: action.data,
      };
    }

    default:
      return state;
  }
};

export default reducer;
