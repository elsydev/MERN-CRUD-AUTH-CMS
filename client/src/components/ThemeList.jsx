import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContex.jsx";

const ThemeList = () => {
  const {
    message: themeMessage,
    errors: themeErrors,
    themes,
    getThemes,
  } = useTheme();
  const [themeList, setThemeList] = useState([]);
  const [selectValue, setSelectValue] = useState("");
  const [selectOption, setSelectOption] = useState("");
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    const fetchThemes = async () => {
      await getThemes();
      setThemeList(themes);
      console.log(themeList);
    };

    fetchThemes();
  }, []);
  const handleSelectChange = (e) => {
    setSelectValue(e.target.value);
    console.log(selectValue);
  };
  const handleOptionChange = (e) => {
    setSelectOption(e.target.value);
    console.log(selectOption);
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black">
      <form>
        <div className="mb-4">
          <label>Temática</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black"
            value={selectValue}
            required
            onChange={handleSelectChange}
          >
            {themeList.map((item) => (
              <option
                key={item.id}
                value={item.id}
                onChange={handleOptionChange}
              >
                {item.themeName}
              </option>
            ))}
          </select>
          {selectValue && (
            <p className="text-black">Tematica seleccionado: {selectValue}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ThemeList;
