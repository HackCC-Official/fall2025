"use client";

import { create } from "zustand";

interface ContactState {
    selected: string | null; // Email
    selectedId: number | null; // ID of the selected contact
}

interface ContactStore {
    contact: ContactState;
    setContact: (contact: Partial<ContactState>) => void;
}

const useContactStore = create<ContactStore>((set) => ({
    contact: {
        selected: null,
        selectedId: null,
    },
    setContact: (contactUpdate) =>
        set((state) => ({
            contact: {
                ...state.contact,
                ...contactUpdate,
            },
        })),
}));

export const useContact = () => {
    const contact = useContactStore((state) => state.contact);
    const setContact = useContactStore((state) => state.setContact);
    return [contact, setContact] as const;
};
