import { io } from "socket.io-client";
import { create } from "zustand";

import { SERVER_URL } from "../constanst";
import useRequestStore from "./useRequestStore";

const useSocketStore = create((set, get) => ({
  socket: null,

  initializeSocket: (userData) => {
    if (!userData) {
      //console.warn(
      //  "User data is not available. Socket will not be initialized."
      //);
      return;
    }

    const socket = io(SERVER_URL, {
      query: {
        userId: userData.uid,
      },
    });

    socket.on("connect", () => {
      //console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      //console.log("Socket disconnected");
    });

    socket.on("newMessage", (newData) => {
      const { updateMessages } = useRequestStore.getState();
      updateMessages(newData);
    });

    socket.on("stateChange", (updateData) => {
      const { updateRequests } = useRequestStore.getState();
      updateRequests(updateData.request);
    });

    set({ socket });

    return () => {
      socket.disconnect();
      //console.log("Socket disconnected due to userData being null");
    };
  },

  closeSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      //console.log("Socket closed manually");
      set({ socket: null, isConnected: false });
    }
  },
}));

export default useSocketStore;
