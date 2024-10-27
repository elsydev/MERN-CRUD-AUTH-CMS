import React from "react";
import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
const ProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <h1>Loading...</h1>;
  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="py-10 lg:py-20 mx-auto w-[450px]">
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProtectedRoute;
