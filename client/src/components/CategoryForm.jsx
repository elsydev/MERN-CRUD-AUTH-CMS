import React, { useContext, useState, useEffect } from "react";
import { useCategory } from "../context/CategoryContext.jsx";

const CategoryForm = () => {
  const { addCategory, message, errors: addCategoryErrors } = useCategory();
  const [previewSource, setPreviewSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [messageValidation, setMessageValidation] = useState("");
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [permissions, setPermissions] = useState({
    imagen: false,

    video: false,

    documento: false,
  });

  // Función para manejar el cambio de checkbox
  const handleCheckboxChange = (event) => {
    const { value } = event.target;

    // Si el checkbox que se selecciona es el mismo que el actualmente seleccionado, se deselecciona

    const newSelectedCheckbox = selectedCheckbox === value ? null : value;

    setSelectedCheckbox(newSelectedCheckbox);

    // Actualizar el objeto permissions

    setPermissions({
      imagen: value === "imagen" && selectedCheckbox !== value,

      video: value === "video" && selectedCheckbox !== value,

      documento: value === "documento" && selectedCheckbox !== value,
    });
  };

  // Para mostrar el estado actual de permissions en la consola

  console.log("Permissions:", permissions);

  useEffect(() => {
    if (messageValidation != "") {
      const timer = setTimeout(() => {
        setMessageValidation("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messageValidation]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setCoverImage(image);
      console.log(coverImage);
      setPreviewSource(reader.result);
      console.log(coverImage);
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (categoryName === "" || coverImage == null) {
      setMessageValidation(
        "El nombre de la categoría y la imagen de portada son requeridos"
      );
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
    formData.append("categoryName", categoryName);
    formData.append("coverImage", coverImage);
    //formData.append("permissions",permissions);
    for (const [key, value] of Object.entries(permissions)) {
      formData.append(key, value);
    }

    console.log("Esto es formdata para ir a context category", formData);
    await addCategory(formData);
    console.log(message);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Agregar categoría</h1>
      {addCategoryErrors.map((error, i) => (
        <p className="bg-red-500" key={i}>
          {error}
        </p>
      ))}

      {messageValidation != "" ? (
        <p className="bg-red-500">{messageValidation}</p>
      ) : (
        ""
      )}

      <form onSubmit={onSubmit} className="space-y-6">
      

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la categoría
          </label>

          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            title="Nombre sólo acepta letras y espacios en blanco"
            pattern="^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$"
            required
            className={
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
            }
          />
        </div>

     

        <div className="flex flex-col sm:flex-1 gap-2">
          <label className="text-[16px] text-stone-600">Imagen de Perfil</label>
          <div className="flex items-center gap-3 ">
            <img
              src={previewSource ? previewSource : "/imageHolder.jpg"}
              alt="previewSource"
              className="w-14 h-14 rounded-full mb-3"
            />
            <input type="file" onChange={imageHandler} required />
          </div>
        </div>

 

        <div>
          <label>
            <input
              type="checkbox"
              value="imagen"
              checked={selectedCheckbox === "imagen"}
              onChange={handleCheckboxChange}
            />
            Imagen
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="video"
              checked={selectedCheckbox === "video"}
              onChange={handleCheckboxChange}
            />
            Video
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              value="documento"
              checked={selectedCheckbox === "documento"}
              onChange={handleCheckboxChange}
            />
            Documento
          </label>
        </div>

 

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
          {isSubmitting ? "Creando..." : "Crear Categoría"}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
