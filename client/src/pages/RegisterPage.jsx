import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link, Navigate } from "react-router-dom";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const password = useRef(null);
  password.current = watch("password", "");
  const { signUp, user, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  /*****Para usar sin React Hook Form***** */
  //const [username,setUserName]=useState("");
  //const [email,setEmail]=useState("");
  //const [password,setPassword]=useState("");
  //const [profileImage,setProfileImage]=useState(null)
  /*****Fin Para usar sin React Hook Form***** */
  const [image, setImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  //console.log(user)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
      reset();
    }
  }, [isAuthenticated]);
  const onSubmit = handleSubmit(async (values) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("role", values.role);
    formData.append("profileImage", values.profileImage);

    console.log("esto es formData desde Register Page", formData);
    signUp(formData);
  });
  /* const handleRegisterSumit= (e) =>{
    e.preventDefault();
    const formData=new FormData();
    formData.append("username",username);
    formData.append("email",email);
    formData.append("password",password);
    formData.append("profileImage",profileImage);
    signUp(formData)
  } */
  const imageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setValue("profileImage", file);
      setProfileImagePreview(reader.result);
      console.log(image);
    };
  };
  return (
    <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
      <div className="bg-zinc-800 max-w-md p-10 rounded-md">
        <h1 className="text-5xl font-black text-white">Crea tu Cuenta</h1>
        <p className="text-2xl font-light text-white mt-5">
          Ingresa {""}
          <span className=" text-fuchsia-500 font-bold"> tus datos</span>
        </p>
        {registerErrors.map((error, i) => (
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
                message:
                  "El nombre de usuario debe tener al menos 2 caracteres",
              },
              maxLength: {
                value: 20,
                message:
                  "El nombre de usuario debe tener menos de 20 caracteres",
              },
            })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Escriba su Nombre de usuario"
            pattern="^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
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
          <div>
            <label htmlFor="rol">Rol:</label>
            <select
              name="role"
              id="rol"
              {...register("role")}
              className="text-black"
            >
              <option value="Creador">Creador</option>
              <option value="Lector">Lector</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-1 gap-2">
            <label className="text-[16px] text-stone-600">
              Imagen de Perfil
            </label>
            <div className="flex items-center gap-3 ">
              <img
                src={
                  profileImagePreview ? profileImagePreview : "/imageHolder.jpg"
                }
                alt="profileImagePreview"
                className="w-14 h-14 rounded-full mb-3"
              />
              <input type="file" onChange={imageHandler} />
            </div>
          </div>

          <button type="submit">Registrar</button>
        </form>

        <p className="flex gap-2 justify-between">
          Ya tienes cuenta?{" "}
          <Link className="text-sky-500" to="/login">
            Login
          </Link>
        </p>
        <p className="flex gap-2 justify-between">
          Olvidaste tu password?{" "}
          <Link className="text-sky-500" to="/forgot-password">
            Reestablecer
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
