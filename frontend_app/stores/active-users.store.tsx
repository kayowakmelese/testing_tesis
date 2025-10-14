'use client'
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ActiveUsersState {
  activeUsersId: string[];
}

interface ActiveUsersActions {
  initActiveUsersId: (ids: string[]) => void;
  addActiveUserId: (id: string) => void;
  removeActiveUserId: (id: string) => void;
  hasActiveUser: (id: string) => boolean;
}

const useActiveUsersStore = create<
  ActiveUsersState & ActiveUsersActions
>()(
  immer((set, get) => ({
    activeUsersId: [],

    initActiveUsersId(ids) {
      set({ activeUsersId: ids });
    },

    addActiveUserId(id) {
      set((state) => {
        if (!state.activeUsersId.includes(id)) {
          state.activeUsersId.push(id);
        }
      });
    },

    removeActiveUserId(id) {
      set((state) => {
        state.activeUsersId = state.activeUsersId.filter(
          (userId) => userId !== id
        );
      });
    },

    hasActiveUser(id) {
      return get().activeUsersId.includes(id);
    },
  }))
);


// 📌 Read-only: get list of active user IDs
export const useActiveUsers = () => {
  return useActiveUsersStore((state) => state.activeUsersId);
};

// 📌 Read-only: check if a specific user is active
export const useIsUserActive = (userId: string) => {
  return useActiveUsersStore((state) => state.hasActiveUser(userId));
};

// 📌 Write-only: actions (for WebSocket, API, etc.)
export const useActiveUsersActions = () => {
  return {
    initActiveUsersId: useActiveUsersStore.getState().initActiveUsersId,
    addActiveUserId: useActiveUsersStore.getState().addActiveUserId,
    removeActiveUserId: useActiveUsersStore.getState().removeActiveUserId,
  };
};