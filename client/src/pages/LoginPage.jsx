import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();
  const {
    signIn,
    user,
    isAuthenticated,
    errors: signInErrors,
    isLogged,
  } = useAuth();
  console.log("Desde Login", user);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated]);
  const onSubmit = handleSubmit(async (values) => {
    signIn(values);
    //reset()
  });
  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
      <div className="bg-zinc-800 max-w-md p-10 rounded-md">
        <h1 className="text-5xl font-black text-white">Entra a tu Cuenta</h1>
        <p className="text-2xl font-light text-white mt-5">
          Ingresa {""}
          <span className=" text-fuchsia-500 font-bold"> tus datos</span>
        </p>
        {signInErrors.map((error, i) => (
          <p className="bg-red-500" key={i}>
            {error}
          </p>
        ))}
        <div className="bg-zinc-800 max-w-md w-ful p-10 rounded-md">
          <form onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "El campo email es requerido",
                },
                pattern: {
                  value:
                    /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/,
                  message: "Correo no válido",
                },
              })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              placeholder="Escriba su Email"
              pattern="^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              placeholder="Escriba su Contraseña"
            />
            {errors.password && (
              <p className="text-red-500">El password requerido</p>
            )}
            {/*    <div>
<label htmlFor="archivo">subir nombre de archivo:</label>
<input
  type="file"
  onChange={(e) => {
    setValue("profileImage", e.target.files[0].name);
  }}
/>
</div> */}
            <button type="submit">Login</button>
          </form>
          <p className="flex gap-2 justify-between">
            No Tienes uns cuenta aun?{" "}
            <Link className="text-sky-500" to="/register">
              Registrar
            </Link>
          </p>
          <p className="flex gap-2 justify-between">
            Olvidaste tu password?{" "}
            <Link className="text-sky-500" to="/forgot-password">
              Reestablecer
            </Link>
          </p>
        </div>
      </div>{" "}
    </section>
  );
};

export default LoginPage;
