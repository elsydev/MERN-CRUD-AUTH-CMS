import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCategory } from "../context/CategoryContext.jsx";
import { addThemeRequest, getThemesRequest } from "../api/theme.js";

const ThemeContext = createContext();
const navigate = useNavigate;
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themes, setThemes] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const addTheme = async (values) => {
    console.log("En Theme Context", values);
    try {
      const res = await addThemeRequest(values);
      setMessage(res.data.message);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const getThemes = async (values) => {
    try {
      const res = await getThemesRequest();
      console.log(res.data);
      setThemes(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ThemeContext.Provider
      value={{
        addTheme,
        message,
        errors,
        themes,
        getThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
