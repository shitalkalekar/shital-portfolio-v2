import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("adminToken") || null,

  admin: JSON.parse(
    localStorage.getItem("adminUser") || "null"
  ),

  isAuthenticated: !!localStorage.getItem("adminToken"),

  login: (data) => {
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem(
      "adminUser",
      JSON.stringify(data.data)
    );

    set({
      token: data.token,
      admin: data.data,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    set({
      token: null,
      admin: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;