import { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import NewPasswordToken from "../components/NewPasswordToken.jsx";
import NewPasswordForm from "../components/NewPasswordForm.jsx";

const NewPassword = () => {
  const {
    isAuthenticated,
    user,
    confirmingAccount,
    isConfirmed,
    isValidToken,
    toUpdatePassword,
    passwordChanged,
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isValidToken) {
      console.log("token Válido");
    }
  }, [isValidToken]);
  useEffect(() => {
    if (passwordChanged) navigate("/login");
  }, [passwordChanged]);
  console.log();
  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      {!isValidToken ? <NewPasswordToken /> : <NewPasswordForm />}
    </div>
  );
};

export default NewPassword;
