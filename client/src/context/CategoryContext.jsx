import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { addCategoryRequest, getCategoriesRequest } from "../api/category.js";

const CategoryContext = createContext();
const navigate = useNavigate;
export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategory must be used within a CategoryProvider");
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const addCategory = async (values) => {
    console.log("En Category Context", values);
    try {
      const res = await addCategoryRequest(values);
      setMessage(res.data.message);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const getCategories = async (values) => {
    try {
      const res = await getCategoriesRequest();
      console.log(res.data);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CategoryContext.Provider
      value={{
        addCategory,
        message,
        errors,
        categories,
        getCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
