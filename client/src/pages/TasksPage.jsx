import { React, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
const TasksPage = () => {
  const { user, logout, message } = useAuth();
  console.log(user);
  const handleLogout = async () => {
    logout();
  };

  const handleProfile = () => {
    console.log("Desde Handle Profile", user);
    console.log("Desde Handle Profile el mensaje es", message);
  };
  return (
    <div className="flex flex-col">
      <h1>Tasks Page</h1>
      <button onClick={handleLogout}>LogOut</button>
      <Link to="/profile">Profile</Link>
    </div>
  );
};

export default TasksPage;
