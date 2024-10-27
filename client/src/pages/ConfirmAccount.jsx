import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useNavigate, Link } from "react-router-dom";
const ConfirmAccount = () => {
  const {
    isAuthenticated,
    user,
    confirmingAccount,
    errors: confirmErrors,
    isConfirmed,
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
  const handleChange = (token) => {
    setToken(token);
  };

  useEffect(() => {
    if (isConfirmed) {
      navigate("/login");
    }
  }, [isConfirmed]);


  const onSubmit = handleSubmit(async (values) => {
    confirmingAccount(values);
    reset();
  });
  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>
      {confirmErrors.map((error, i) => (
        <p className="bg-red-500" key={i}>
          {error}
        </p>
      ))}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("token", { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Escriba su token"
        />
        <button type="submit">Confirmar</button>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/new-code"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </div>
  );
};

export default ConfirmAccount;
