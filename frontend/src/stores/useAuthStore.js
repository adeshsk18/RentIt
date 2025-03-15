import { create } from "zustand";

const useAuthStore = create((set) => {
  const storedToken = sessionStorage.getItem("token");
  const storedUserData = sessionStorage.getItem("userData");

  return {
    userData: storedUserData ? JSON.parse(storedUserData) : null,
    token: storedToken || null,

    setAuthData: (userData, token) => {
      sessionStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("token", token);
      set({ userData, token });
    },

    removeAuthData: () => {
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("token");
      set({ userData: null, token: null });
    },

    updateUserData: (newUserData) =>
      set((state) => {
        const updatedUser = { ...state.userData, ...newUserData };
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        return { userData: updatedUser };
      }),
  };
});

export default useAuthStore;
