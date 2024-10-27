import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link, Navigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, getProfile } = useAuth();
  useEffect(() => {
    getProfile();
    console.log(user);
  }, []);
  const goToUpdate = () => {
    navigate(`/profile/update/${user.id}`);
  };
  return (
    <div>
      <h1 className="text-5xl font-black text-white">Tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Visualiza o Edita {""}
        <span className=" text-fuchsia-500 font-bold"> tus datos</span>
      </p>
      <div className="flex flex-col rounded-2xl w-96 bg-[#ffffff] shadow-xl">
        <div className="flex justify-center items-center rounded-2xl">
          <img
            src={user.profileImage.url}
            alt="Card Preview"
            className="rounded-t-2xl"
          />
        </div>
        <div className="flex flex-col p-8">
          <div className="text-2xl font-bold   text-[#374151] pb-6">
            Nombre de Usuario
          </div>
          <div className=" text-lg   text-[#374151]">{user.username}</div>
          <div className="text-2xl font-bold   text-[#374151] pb-6">Email</div>
          <div className=" text-lg   text-[#374151]">{user.email}</div>
          <div className="text-2xl font-bold   text-[#374151] pb-6">Rol</div>
          <div className=" text-lg   text-[#374151]">{user.role}</div>
          <div className="text-2xl font-bold   text-[#374151] pb-6">
            Miembro desde:
          </div>
          <div className=" text-lg   text-[#374151]">{user.createdAt}</div>
          <div className="flex justify-end pt-6">
            <button
              onClick={goToUpdate}
              className="bg-[#7e22ce] text-[#ffffff]  font-bold text-base  p-3 rounded-lg hover:bg-purple-800 active:scale-95 transition-transform transform"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
