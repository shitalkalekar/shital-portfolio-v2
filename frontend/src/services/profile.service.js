import api from "./api.js";

export const getProfile = async () => {
  const response = await api.get("/profile");

  return response.data;
};

export const createProfile = async (data) => {
  const response = await api.post("/profile", data);

  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/profile", data);

  return response.data;
};

export const deleteProfile = async () => {
  const response = await api.delete("/profile");

  return response.data;
};