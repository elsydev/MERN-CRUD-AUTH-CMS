import React, { useState } from "react";

const CheckboxGroup = () => {
  const [permissions, setPermissions] = useState({});

  const handleChange = (event) => {
    const { name, checked } = event.target;

    setPermissions({ ...permissions, [name]: checked });
  };

  return (
    <div>
      <label>
        <input type="checkbox" name="imagen" onChange={handleChange} />
        Imagen
      </label>

      <label>
        <input type="checkbox" name="video" onChange={handleChange} />
        Video
      </label>

      <label>
        <input type="checkbox" name="documento" onChange={handleChange} />
        Documento
      </label>

      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </div>
  );
};

export default CheckboxGroup;
