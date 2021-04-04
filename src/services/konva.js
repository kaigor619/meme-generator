import Konva from "konva";

export const createStage = (id) => {
  const stage = new Konva.Stage({
    container: id, // id of container <div>
    width: 500,
    height: 500,
  });

  return stage;
};
