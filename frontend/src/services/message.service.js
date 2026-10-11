import api from "./api.js";

// ========================================
// CREATE MESSAGE - PUBLIC CONTACT FORM
// ========================================

export const createMessage = async (data) => {
  const response = await api.post("/messages", data);

  return response.data;
};

// ========================================
// GET ALL MESSAGES
// ========================================

export const getMessages = async () => {
  const response = await api.get("/messages");

  return response.data;
};

// ========================================
// GET SINGLE MESSAGE
// ========================================

export const getMessageById = async (id) => {
  const response = await api.get(
    `/messages/${id}`
  );

  return response.data;
};

// ========================================
// UPDATE MESSAGE
// ========================================

export const updateMessage = async (
  id,
  data
) => {
  const response = await api.put(
    `/messages/${id}`,
    data
  );

  return response.data;
};

// ========================================
// DELETE MESSAGE
// ========================================

export const deleteMessage = async (id) => {
  const response = await api.delete(
    `/messages/${id}`
  );

  return response.data;
};

