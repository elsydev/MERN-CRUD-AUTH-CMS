import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link, Navigate } from "react-router-dom";

const ForgotPassword = () => {
  const {
    isAuthenticated,
    user,
    requirePasswordChange,
    errors: passwordErrors,
    isConfirmed,
    isTokenSent,
    setIsTokenSent,
  } = useAuth();
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();
  const navigate = useNavigate();
  useEffect(() => {
    if (isTokenSent) {
      navigate("/");
    }
  }, [isTokenSent]);

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    requirePasswordChange(values);
    reset();
  });
  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <h1 className="text-5xl font-black text-white">Restablece tu Password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa tu email{""}
        <span className=" text-fuchsia-500 font-bold">
          {" "}
          y reestablece tu password
        </span>
      </p>
      {passwordErrors.map((error, i) => (
        <p className="bg-red-500" key={i}>
          {error}
        </p>
      ))}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("email", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Escriba su email"
        />
        <button type="submit">Solicitar reset</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
