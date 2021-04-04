import { ELEMENT_TYPE } from "types/constant";
import { TEXT_OPTIONS_TEMPLATE } from "types/elements";

import canvasBackground from "assets/images/canvas-background.jpg";

const types = {
  ADD_ELEMENT: "ADD_ELEMENT",
  DELETE_ELEMENT: "DELETE_ELEMENT",
  UPDATE_ELEMENT: "UPDATE_ELEMENT",
};

export const handleAddElement = () => {
  return {
    type: types.ADD_ELEMENT,
    payload: TEXT_OPTIONS_TEMPLATE,
  };
};

const initialState = {
  canvas: {
    container: "container",
    width: 500,
    height: 400,
  },
  elements: [
    {
      id: 1,
      type: ELEMENT_TYPE.background,
      src: canvasBackground,
      x: 0,
      y: 0,
      width: 500,
      height: 400,
    },
    // {
    //   id: 1,
    //   type: ELEMENT_TYPE.image,
    //   src:
    //     "https://i.pinimg.com/originals/7a/f3/03/7af3035dd777c2fa81b1bc862f5c5a90.png",
    //   x: 0,
    //   y: 0,
    // },
    // {
    //   id: 2,
    //   type: ELEMENT_TYPE.text,
    //   text: "That's our secret",
    //   style: {
    //     fontFamily: "Impact",
    //     fontWeight: "bold",
    //     fontSize: 40,
    //     fill: "#fff",
    //     // stroke: "#000",
    //     // strokeWidth: 1,
    //     shadowColor: "#000",
    //     shadowOffsetX: 0,
    //     shadowOffsetY: 0,
    //     shadowOpacity: 1,
    //     shadowBlur: 10,
    //   },
    // },
    // {
    //   id: 3,
    //   type: ELEMENT_TYPE.text,
    //   text: "There is no plan",
    //   style: {
    //     fontFamily: "Impact",
    //     fontWeight: "bold",
    //     fontSize: 40,
    //     fill: "#fff",
    //     // stroke: "#000",
    //     // strokeWidth: 1,
    //     shadowColor: "#000",
    //     shadowOffsetX: 0,
    //     shadowOffsetY: 0,
    //     shadowOpacity: 1,
    //     shadowBlur: 10,
    //   },
    // },
  ],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_ELEMENT: {
      return {
        ...state,
        elements: [...state.elements, action.payload],
      };
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
          state.elements.filter((item) => item.id !== action.payload.id),
          action.payload,
        ],
      };
    }

    default:
      return state;
  }
};

export default reducer;
