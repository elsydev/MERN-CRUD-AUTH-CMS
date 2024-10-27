import axios from "./axios.js";

export const addCategoryRequest = async (category) =>
  axios.post(`/category/add-category`, category);
export const getCategoriesRequest = async () => axios.get("/category/all");
