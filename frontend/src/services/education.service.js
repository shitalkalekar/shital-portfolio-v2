import api from "./api.js";

// Get all education records
export const getEducations = async () => {
  const response = await api.get("/education");

  return response.data;
};

// Get one education record
export const getEducationById = async (id) => {
  const response = await api.get(`/education/${id}`);

  return response.data;
};

// Create education
export const createEducation = async (data) => {
  const response = await api.post("/education", data);

  return response.data;
};

// Update education
export const updateEducation = async (id, data) => {
  const response = await api.put(`/education/${id}`, data);

  return response.data;
};

// Delete education
export const deleteEducation = async (id) => {
  const response = await api.delete(`/education/${id}`);

  return response.data;
};