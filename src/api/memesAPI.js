import { apiHelper } from "utils/api";
import { types } from "reducers/index";

export const fetchGetMemes = () => {
  return apiHelper({
    url: "/memes",
  });
};

export const fetchGetMeme = (memeId) => {
  return apiHelper({
    url: `/memes/${memeId}`,
  });
};

export const fetchGetMemeBackgrounds = () => {
  return apiHelper({
    url: `/memes/backgrounds`,
    type: types.GET_BACKGROUNDS,
  });
};

export const fetchCreateMeme = (data) => {
  return apiHelper({
    url: `/memes`,
    method: "post",
    contentType: "multipart/form-data",
    data: data,
  });
};
