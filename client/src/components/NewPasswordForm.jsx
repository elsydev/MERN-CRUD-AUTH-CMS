import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link, Navigate } from "react-router-dom";

const NewPasswordForm = () => {
  const {
    isAuthenticated,
    user,
    confirmingAccount,
    errors: newPasswordErrors,
    isConfirmed,
    isValidToken,
    toUpdatePassword,
    updatingPassword,
    passwordChanged,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const password = useRef(null);
  password.current = watch("password", "");

  const onSubmit = handleSubmit(async (values) => {
    setValue("token", toUpdatePassword);
    console.log(values.password, toUpdatePassword);
    updatingPassword(values.password, toUpdatePassword);
    reset();
  });
  useEffect(() => {
    if (passwordChanged) navigate("/login");
  }, [passwordChanged]);
  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <h1 className="text-5xl font-black text-white">Cambia tu Contraseña</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa {""}
        <span className=" text-fuchsia-500 font-bold"> tus datos</span>
      </p>
      {newPasswordErrors.map((error, i) => (
        <p className="bg-red-500" key={i}>
          {error}
        </p>
      ))}

      {/***************** Con React Hook Form**********************/}
      <form onSubmit={onSubmit}>
        <input
          type="password"
          name="password"
          {...register("password", {
            required: {
              value: true,
              message: "Confirmar password es requerido",
            },
            minLength: {
              value: 8,
              message: "El password debe tenr minimo 8 caracteres",
            },
          })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Escriba su Contraseña"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <input
          type="password"
          name="confirmarPassword"
          {...register("confirmarPassword", {
            required: {
              value: true,
              message: "Confirmar password es requerido",
            },
            minLength: {
              value: 8,
              message: "El password debe tenr minimo 8 caracteres",
            },
            validate: (value) =>
              value === password.current || "Las contraseñas no coinciden",
          })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Escriba su Contraseña"
        />
        {errors.confirmarPassword && (
          <p className="text-red-500">{errors.confirmarPassword.message}</p>
        )}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
