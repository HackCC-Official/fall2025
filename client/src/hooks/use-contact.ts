import { create } from "zustand";

interface ContactState {
    selected: string | null;
}

const useContactStore = create<ContactState>((set) => ({
    selected: null,
}));

export const useContact = () => {
    const store = useContactStore();
    return [store, useContactStore.setState] as const;
}; 