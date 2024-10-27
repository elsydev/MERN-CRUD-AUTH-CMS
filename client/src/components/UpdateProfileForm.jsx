import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link, Navigate } from "react-router-dom";

const UpdateProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const { signUp, user, isAuthenticated, errors: updateErrors } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("En Update profile form el user es:", user);
  }, []);
  const onSubmit = handleSubmit(() => {
    console.log("En OnSubmit el user es:", user);
  });
  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setValue("profileImage", file);
      console.log(profileImage);
    };
  };

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <h1 className="text-5xl font-black text-white">Actualiza tu Perfil</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa {""}
        <span className=" text-fuchsia-500 font-bold"> tus datos</span>
      </p>
      {updateErrors.map((error, i) => (
        <p className="bg-red-500" key={i}>
          {error}
        </p>
      ))}

      {/***************** Con React Hook Form**********************/}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          {...register("username", {
            required: {
              value: true,
              message: "El nombre de usuario es requerido",
            },
            minLength: {
              value: 2,
              message: "El nombre de usuario debe tener al menos 2 caracteres",
            },
            maxLength: {
              value: 20,
              message: "El nombre de usuario debe tener menos de 20 caracteres",
            },
          })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Escriba su Nombre de usuario"
          pattern="^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}

        <div>
          <label htmlFor="rol">Rol:</label>
          <select
            name="role"
            id="rol"
            {...register("role")}
            className="text-black"
          >
            <option value="Auctioneer">Auctioneer</option>
            <option value="Bidder">Bidder</option>
          </select>
        </div>
        <div>
          <label htmlFor="archivo">subir nombre de archivo:</label>
          <input type="file" onChange={imageHandler} />
        </div>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default UpdateProfileForm;
