export interface Mail {
    id: string;
    name: string;
    email: string;
    subject: string;
    text: string;
    date: string;
    read: boolean;
    labels: string[];
    selected?: boolean;
}

export interface MailState {
    selected: string | null;
} 