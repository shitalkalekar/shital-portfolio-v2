
import api from "./api.js";

// Get all certifications
export const getCertifications = async () => {
  const response = await api.get("/certifications");
  return response.data;
};

// Get one certification
export const getCertificationById = async (id) => {
  const response = await api.get(`/certifications/${id}`);
  return response.data;
};

// Create certification
export const createCertification = async (data) => {
  const response = await api.post("/certifications", data);
  return response.data;
};

// Update certification
export const updateCertification = async (id, data) => {
  const response = await api.put(`/certifications/${id}`, data);
  return response.data;
};

// Delete certification
export const deleteCertification = async (id) => {
  const response = await api.delete(`/certifications/${id}`);
  return response.data;
};
