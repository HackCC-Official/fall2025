import { create } from "zustand";
import { MailState } from "@/types/mail";

const useMailStore = create<MailState>((set) => ({
    selected: null,
}));

export const useMail = () => {
    const store = useMailStore();
    return [store, useMailStore.setState] as const;
}; 