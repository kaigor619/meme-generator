import axios from "axios";
import store from "store";
const API_ROOT = process.env.REACT_APP_API_ROOT;

export const apiHelper = async (action) => {
  const headers = {
    "Content-Type": action.contentType || "application/json",
  };

  const config = {
    baseURL: API_ROOT,
    url: action.url,
    method: action.method || "get",
    data: action.data || {},
    params: action.query || {},
    timeout: action.timeout || 8000,
    responseType: action.responseType || "json",
    headers,
  };

  try {
    const response = await axios(config);
    if (action.type) store.dispatch({ type: action.type, data: response.data });

    return response.data;
  } catch (e) {
    console.log(e);
  }
};
