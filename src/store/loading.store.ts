import create from 'zustand';

type LoadingState = {
  loadingState: boolean;
};

type LoadingActions = {
  startLoading: () => void;
  stopLoading: () => void;
};

const useLoadingStore = create<LoadingState & LoadingActions>((set) => ({
  loadingState: false,
  startLoading: () => set({ loadingState: true }),
  stopLoading: () => set({ loadingState: false }),
}));

export default useLoadingStore;
