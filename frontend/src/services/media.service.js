import api from "./api.js";

export const uploadImage = async (file) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await api.post("/media/upload", formData);

    return response.data;
};
