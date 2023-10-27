import create from "zustand";

interface ModalStore {
  userIdAcceptOrDeny: string | null;
  isModalOpen: boolean;
  type: "accept" | "recuse" | "exclude_blacklist" | null;
  openModal: (userId: string, type: "accept" | "recuse" | "exclude_blacklist" | null) => void;
  closeModal: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
  userIdAcceptOrDeny: null,
  isModalOpen: false,
  type: null,

  openModal: (userId, type) => {
    set({ isModalOpen: true }),
      set({ type: type }),
      set({ userIdAcceptOrDeny: userId });
  },

  closeModal: () => {
    set({ isModalOpen: false }),
    set({ type: null }),
    set({ userIdAcceptOrDeny: null });
  },
}));

export default useModalStore;
