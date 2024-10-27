import axios from "./axios.js";

const API = "http://localhost:3000/api";

export const registerRequest = async (user) =>
  axios.post(`/auth/register`, user);

export const loginRequest = async (user) => axios.post(`/auth/login`, user);
export const confirmRequest = async (tok) =>
  axios.post("/auth/confirm-account", tok);

export const verifyTokenRequest = async () => axios.get("/auth/verify");

export const registerWithFile = async (dataUser) =>
  axios.post(`/auth/register`, dataUser, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const requirePasswordRequest = async (value) =>
  axios.post("/auth/forgot-password", value);
export const validatePasswordToken = async (token) =>
  axios.post("/auth/validate-token", token);
export const updatePasswordRequest = async (newPassword, token) => {
  console.log("En updatePasswordRequest", newPassword);
  console.log("En updatePasswordRequest", token);
  return axios.post(`/auth/update-password/${token}`, { newPassword });
};
export const getProfileRequest = async () => axios.get("/auth/profile");
