// stores/preloader-store.ts
import { create } from "zustand";

interface PreloaderStore {
	isComplete: boolean;
	setComplete: () => void;
}

export const usePreloaderStore = create<PreloaderStore>((set) => ({
	isComplete: false,
	setComplete: () => set({ isComplete: true }),
}));
