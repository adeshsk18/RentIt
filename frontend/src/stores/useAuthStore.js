import { create } from "zustand";

const useAuthStore = create((set) => {
  const storedToken = localStorage.getItem("token");
  const storedUserData = localStorage.getItem("userData");

  return {
    userData: storedUserData ? JSON.parse(storedUserData) : null,
    token: storedToken || null,

    setAuthData: (userData, token) => {
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("token", token);
      set({ userData, token });
    },

    removeAuthData: () => {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      set({ userData: null, token: null });
    },

    updateUserData: (newUserData) =>
      set((state) => {
        const updatedUser = { ...state.userData, ...newUserData };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        return { userData: updatedUser };
      }),
  };
});

export default useAuthStore;
