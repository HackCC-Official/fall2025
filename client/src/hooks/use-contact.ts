"use client";

import { create } from "zustand";

interface ContactState {
    selected: string | null;
}

interface ContactStore {
    contact: ContactState;
    setContact: (contact: ContactState) => void;
}

const useContactStore = create<ContactStore>((set) => ({
    contact: {
        selected: null,
    },
    setContact: (contact) => set({ contact }),
}));

export const useContact = () => {
    const contact = useContactStore((state) => state.contact);
    const setContact = useContactStore((state) => state.setContact);
    return [contact, setContact] as const;
}; 