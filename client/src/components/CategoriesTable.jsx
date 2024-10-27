import { useState, useEffect } from "react";
import CategoryForm from "../components/CategoryForm";
import { useCategory } from "../context/CategoryContext.jsx";

const CategoriesTable = () => {
  const {
    message: categoryMessage,
    errors: categoriesErrors,
    categories,
    getCategories,
  } = useCategory();
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      await getCategories();
      setCategoriesList(categories);
      console.log(categoriesList);
    };

    fetchCategories();
  }, []);
  return (
    <div className="relative overflow-hidden shadow-md rounded-lg">
      <table className="table-fixed w-full text-left">
        <thead className="uppercase bg-[#6b7280] text-[#e5e7eb]">
          <tr>
            <td className="py-1 border text-center  p-4" contenteditable="true">
              Categoria
            </td>
            <td className="py-1 border text-center  p-4" contenteditable="true">
              Description
            </td>
            <td className="py-1 border text-center  p-4" contenteditable="true">
              Permisos
            </td>
            <td className="py-1 border text-center  p-4" contenteditable="true">
              Acciones
            </td>
          </tr>
        </thead>
        <tbody className="bg-white  text-[#6b7280]">
          <tr className=" py-5">
            {categoriesList.map((item) => (
              <>
                <td
                  className=" py-5 border text-center  p-4"
                  contenteditable="true"
                >
                  {item.categoryName}
                </td>
                <td
                  className=" py-5 border text-center  p-4"
                  contenteditable="true"
                >
                  <img src={item.coverImage.url} />
                </td>
                <td
                  className=" py-5 border text-center  p-4"
                  contenteditable="true"
                >
                  los permisos
                </td>
                <td
                  className=" py-5 border text-center  p-4"
                  contenteditable="true"
                >
                  YY-853599
                </td>
              </>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
