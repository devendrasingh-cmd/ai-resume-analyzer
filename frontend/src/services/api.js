import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAnalysisHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/analyses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAnalysisById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await API.get(`/analyses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default API;

export const deleteAnalysis = async (id) => {
  const token = localStorage.getItem("token");

  const response = await API.delete(`/analyses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
