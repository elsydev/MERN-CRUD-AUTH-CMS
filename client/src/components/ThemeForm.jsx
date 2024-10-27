import React, { useContext, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContex.jsx";
import { useCategory } from "../context/CategoryContext.jsx";
import axios from "axios";

const ThemeForm = () => {
  const {
    message: categoryMessage,
    errors: categoriesErrors,
    categories,
    getCategories,
  } = useCategory();
  const {
    addTheme,
    message: themeMessage,
    errors: themeErrors,
    themes,
    getThemes,
  } = useTheme();
  const [previewSource, setPreviewSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [messageValidation, setMessageValidation] = useState("");
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoriies, setCategoriies] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [permissions, setPermissions] = useState({
    imagen: false,

    video: false,

    documento: false,
  });
  const [catForTheme, setCatForTheme] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [themeName, setThemeName] = useState("");

  const [error, setError] = useState("");

  // Función para manejar el cambio de checkbox

  const handleChangePermission = (event) => {
    const { name, checked } = event.target;

    setPermissions({ ...permissions, [name]: checked });
  };

  console.log("Permissions:", permissions);
  // console.log('categorias:', catForTheme);
  useEffect(() => {
    const fetchCategories = async () => {
      await getCategories();
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (messageValidation != "") {
      const timer = setTimeout(() => {
        setMessageValidation("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messageValidation]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (themeName === "") {
      setMessageValidation("El nombre de la temática es requerida");
      setIsSubmitting(false);
      return;
    }
    if (!permissions.imagen && !permissions.video && !permissions.documento) {
      setMessageValidation(
        "Debe Seleccionar al menos 1 tipo de archivo: Imagen, vido o Documento"
      );
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append("themeName", themeName);

    for (const [key, value] of Object.entries(permissions)) {
      formData.append(key, value);
    }

    console.log("Esto es formdata para ir a context theme", formData);
    await addTheme(formData);
    console.log(themeMessage);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Agregar Temas</h1>

      {messageValidation != "" ? (
        <p className="bg-red-500">{messageValidation}</p>
      ) : (
        ""
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="categoryName">Tipo de Contenido Permitido:</label>

          <label>
            <input
              type="checkbox"
              name="imagen"
              onChange={handleChangePermission}
            />
            Imagen
          </label>
          <label>
            <input
              type="checkbox"
              name="video"
              onChange={handleChangePermission}
            />
            Video
          </label>

          <label>
            <input
              type="checkbox"
              name="documento"
              onChange={handleChangePermission}
            />
            Documento
          </label>
        </div>

        <div>
          <label htmlFor="themeName">Nombre de la Temática:</label>

          <input
            type="text"
            id="themeName"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
  ${
    isSubmitting
      ? "bg-indigo-400 cursor-not-allowed"
      : "bg-indigo-600 hover:bg-indigo-700"
  }`}
        >
          {isSubmitting ? "Creando..." : "Crear Temática"}
        </button>
      </form>
    </div>
  );
};

export default ThemeForm;
