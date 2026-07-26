import { create } from "zustand";

interface NavbarStore {
	isMenuOpen: boolean;
	isCommandMenuOpen: boolean;
	setOpen: (open: boolean) => void;
	setCommandMenuOpen: (open: boolean) => void;
	toggleOpen: () => void;
}

export const useNavbarStore = create<NavbarStore>((set) => ({
	isMenuOpen: false,
	isCommandMenuOpen: false,
	setOpen: (open) => set({ isMenuOpen: open }),
	setCommandMenuOpen: (open) => set({ isCommandMenuOpen: open }),
	toggleOpen: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
