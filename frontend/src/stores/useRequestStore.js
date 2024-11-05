import { create } from "zustand";

const useRequestStore = create((set, get) => ({
  requests: new Map(),
  selectedRequest: null,
  modifiedSwitch: [-1],

  getRequestsCount: function (filter = {}, seenf = null) {
    let count = 0;

    for (const request of get().requests.values()) {
      const matchesFilter = Object.entries(filter).every(
        ([key, value]) => request[key] === value
      );

      if (matchesFilter && (seenf === null || !request[seenf])) {
        count++;
      }
    }

    return count;
  },

  getRequestsArray: (filter = {}) => {
    const { key, value } = filter;
    return Array.from(get().requests.values())
      .filter((request) => (key ? request[key] === value : true))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  },

  updateRequests: (newRequest) =>
    set((state) => {
      const requests = state.requests;
      const existingRequest = requests.get(newRequest._id);

      if (existingRequest) {
        Object.assign(existingRequest, newRequest);
      } else {
        requests.set(newRequest._id, newRequest);
      }

      state.modifiedSwitch[0] = (state.modifiedSwitch[0] + 1) % 10;

      return {};
    }),

  updateMessages: (updateData) =>
    set((state) => {
      const request = state.requests.get(updateData.requestId);
      if (request) {
        request.messages.push(updateData.newMessage);
        request.rseen = updateData.rseen;
        request.lseen = updateData.lseen;
        request.updatedAt = new Date();
        state.modifiedSwitch[0] = (state.modifiedSwitch[0] + 1) % 10;
      }
      return {};
    }),

  setRequests: (requestsArray) =>
    set(() => ({
      requests: new Map(requestsArray.map((req) => [req._id, req])),
      selectedRequest: null,
      modifiedSwitch: [1],
    })),

  selectRequest: (requestId) =>
    set((state) => ({
      selectedRequest: state.requests.get(requestId) || null,
    })),

  clearSelectedRequest: () => set({ selectedRequest: null }),
}));

export default useRequestStore;
