import axios from "axios";

let saveToken = (token) => {
  localStorage.setItem("token", token);
};

let getToken = () => {
  return localStorage.getItem("token");
};

let logout = () => {
  localStorage.removeItem("token");
};

let isLogged = () => {
  let token = localStorage.getItem("token");
  return !!token;
};

let login = (credentials) => {
  return axios.post(process.env.API_URL + "/auth", credentials);
};

let register = (user) => {
  return axios.post(process.env.API_BASE_URL + "/users", user);
};

export const accountService = {
  saveToken,
  getToken,
  logout,
  isLogged,
  login,
  register
};
