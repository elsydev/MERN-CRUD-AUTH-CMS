import axios from "./axios.js";

export const addThemeRequest = async (theme) =>
  axios.post(`/theme/add-theme`, theme);
export const getThemesRequest = async () => axios.get("/theme/all");
