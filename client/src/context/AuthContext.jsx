import { createContext, useState, useContext, useEffect } from "react";
import {
  registerWithFile,
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  confirmRequest,
  requirePasswordRequest,
  validatePasswordToken,
  updatePasswordRequest,
  getProfileRequest,
} from "../api/auth.js";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

const AuthContext = createContext();
const navigate = useNavigate;
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [toUpdatePassword, setToUpdatePassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [isTokenSent, setIsTokenSent] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      console.log("buscando cookies", cookies.token);
      try {
        const res = await verifyTokenRequest(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const signUp = async (values) => {
    /**Sin Image File */
    /*     try {
      const res= await registerRequest(values)
      console.log(res.data)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.log(error)
      setErrors(error.response.data)
    } */
    /********************/

    /**Con Image File */

    try {
      const res = await registerWithFile(values);
      /*  const res= await axios.post(`http://localhost:3000/api/auth/register`,values,{ 
      headers:{
       "Content-Type": "multipart/form-data"
   }}) */
      console.log(res.data);
      setUser(res.data);
      //setIsAuthenticated(true)
      setIsRegistered(true);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };
  const signIn = async (values) => {
    try {
      const res = await loginRequest(values);
      console.log(res.data);
      setUser(res.data);

      setMessage(res.data.message);
      if (res.data.role === "Admin") {
        setIsAdmin(true);
      }
      console.log(user);

      setIsAuthenticated(true);
      setIsLogged(true);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuthenticated(false);
    setIsLogged(false);
  };
  const confirmingAccount = async (values) => {
    console.log("En confirming Account: ", values);
    try {
      const res = await confirmRequest(values);
      console.log(res.data);
      setIsConfirmed(true);
      //setUser(res.data)
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };
  const requirePasswordChange = async (values) => {
    try {
      const res = await requirePasswordRequest(values);
      console.log(res.data);
      if (res.status === 200) {
        setIsTokenSent(true);
      }
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };
  const validateTokenPassword = async (values) => {
    console.log("En validateTokenPassord: ", values);
    try {
 
      const res = await validatePasswordToken(values);
      console.log("He validado token de password en frontend", res.data);
      setIsValidToken(true);
      setUser(res.data);
      setToUpdatePassword(res.data.token);

    
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const updatingPassword = async (newPassword, token) => {
    console.log("En updating password", newPassword);
    console.log("En updating password", token);
    try {
      const res = await updatePasswordRequest(newPassword, token);
      console.log(res.data);
      setToUpdatePassword("");
      setPasswordChanged(true);
      setIsTokenSent(false);
    } catch (error) {
      console.log(error);
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };
  const getProfile = async () => {
    /*const cookies = Cookies.get()
  try {
        const res=await verifyTokenRequest(cookies.token)
   } catch (error) {
    console.log(error)
    } */

    try {
      const res = await getProfileRequest();
      console.log(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        user,
        isAuthenticated,
        isLogged,
        errors,
        confirmingAccount,
        isConfirmed,
        requirePasswordChange,
        validateTokenPassword,
        toUpdatePassword,
        isValidToken,
        setIsValidToken,
        isTokenSent,
        setIsTokenSent,

        setToUpdatePassword,
        updatingPassword,
        passwordChanged,
        setPasswordChanged,
        logout,
        message,
        getProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
