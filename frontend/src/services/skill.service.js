import api from "./api.js";

// Get all skills
export const getSkills = async () => {
  const response = await api.get("/skills");

  return response.data;
};

// Get one skill
export const getSkillById = async (id) => {
  const response = await api.get(`/skills/${id}`);

  return response.data;
};

// Create skill
export const createSkill = async (data) => {
  const response = await api.post("/skills", data);

  return response.data;
};

// Update skill
export const updateSkill = async (id, data) => {
  const response = await api.put(`/skills/${id}`, data);

  return response.data;
};

// Delete skill
export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);

  return response.data;
};