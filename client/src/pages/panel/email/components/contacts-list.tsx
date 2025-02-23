"use client";

import * as React from "react";
import { Search, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useContact } from "@/hooks/use-contact";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { cn } from "@/lib/utils";
import EditContactModal from "./edit-contact-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteContact } from "@/features/outreach/api/outreach";
import { useQueryClient } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactsListProps {
    contacts: ContactDto[];
}

export default function ContactsList({ contacts }: ContactsListProps) {
    const [contact, setContact] = useContact();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [editingContact, setEditingContact] =
        React.useState<ContactDto | null>(null);
    const queryClient = useQueryClient();
    const [deleteId, setDeleteId] = React.useState<number | null>(null);

    const filteredContacts = React.useMemo(() => {
        const contactsArray = Array.isArray(contacts) ? contacts : [];
        return contactsArray.filter(
            (c) =>
                c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [contacts, searchQuery]);

    const handleDelete = async (contactId: number) => {
        try {
            await deleteContact(contactId.toString());
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">Contacts</h1>
            </div>
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <div className="flex-1 overflow-auto">
                {filteredContacts.map((item) => (
                    <div
                        key={item.email}
                        className={cn(
                            "flex items-center justify-between px-4 py-3 border-b hover:bg-accent/50 transition-colors",
                            contact.selected === item.email && "bg-accent"
                        )}
                    >
                        <button
                            onClick={() =>
                                setContact({ ...contact, selected: item.email })
                            }
                            className="flex-1 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                    {item.first_name?.charAt(0).toUpperCase() ||
                                        item.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {`${item.first_name} ${item.last_name}` ||
                                            item.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.email}
                                    </div>
                                </div>
                            </div>
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setEditingContact(item)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteId(item.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
            {editingContact && (
                <EditContactModal
                    contact={editingContact}
                    open={!!editingContact}
                    onOpenChange={(open) => !open && setEditingContact(null)}
                />
            )}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={() => setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the contact.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) handleDelete(deleteId);
                                setDeleteId(null);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
