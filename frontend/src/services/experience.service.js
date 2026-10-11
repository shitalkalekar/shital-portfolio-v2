import api from "./api.js";

// Get all experiences
export const getExperiences = async () => {
  const response = await api.get("/experiences");

  return response.data;
};

// Get one experience
export const getExperienceById = async (id) => {
  const response = await api.get(
    `/experiences/${id}`
  );

  return response.data;
};

// Create experience
export const createExperience = async (data) => {
  const response = await api.post(
    "/experiences",
    data
  );

  return response.data;
};

// Update experience
export const updateExperience = async (
  id,
  data
) => {
  const response = await api.put(
    `/experiences/${id}`,
    data
  );

  return response.data;
};

// Delete experience
export const deleteExperience = async (id) => {
  const response = await api.delete(
    `/experiences/${id}`
  );

  return response.data;
};