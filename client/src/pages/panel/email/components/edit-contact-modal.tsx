"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactDto } from "@/features/outreach/types/contact.dto";
import { useState } from "react";
import { updateContact } from "@/features/outreach/api/outreach";
import { useQueryClient } from "@tanstack/react-query";

interface EditContactModalProps {
    contact: ContactDto;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditContactModal({ contact, open, onOpenChange }: EditContactModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        position: contact.position,
        organization: contact.organization,
    });

    const handleSubmit = async () => {
        try {
            await updateContact(contact.id.toString(), formData);
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update contact:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Contact</DialogTitle>
                    <DialogDescription>
                        Make changes to the contact information here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="first_name" className="text-right">
                            First Name
                        </Label>
                        <Input
                            id="first_name"
                            value={formData.first_name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    first_name: e.target.value,
                                }))
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="last_name" className="text-right">
                            Last Name
                        </Label>
                        <Input
                            id="last_name"
                            value={formData.last_name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    last_name: e.target.value,
                                }))
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="position" className="text-right">
                            Position
                        </Label>
                        <Input
                            id="position"
                            value={formData.position}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    position: e.target.value,
                                }))
                            }
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="organization" className="text-right">
                            Organization
                        </Label>
                        <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    organization: e.target.value,
                                }))
                            }
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 