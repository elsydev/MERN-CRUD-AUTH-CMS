import { useState, useEffect } from "react";
import CategoryForm from "../components/CategoryForm";
import { useCategory } from "../context/CategoryContext.jsx";
import CategoriesTable from "../components/CategoriesTable.jsx";
const CategoryPage = () => {
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
    <section classNameName="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
      
      <CategoriesTable/>
      <CategoryForm />
    </section>
  );
};

export default CategoryPage;
