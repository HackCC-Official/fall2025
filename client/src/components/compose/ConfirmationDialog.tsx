"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { RecipientType } from "../../../pages/panel/email/compose";

interface RecipientConfirmationDetails {
    name: string;
    email: string;
    organization?: string;
}

interface ConfirmationDialogProps {
    isConfirmationOpen: boolean;
    setIsConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    recipientsToConfirm: RecipientConfirmationDetails[];
    handleConfirmedSend: () => Promise<void>;
    recipientType: RecipientType;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isConfirmationOpen,
    setIsConfirmationOpen,
    recipientsToConfirm,
    handleConfirmedSend,
    recipientType,
}) => {
    return (
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Confirm Email Recipients</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        You are about to send emails to the following{" "}
                        {recipientsToConfirm.length} recipient
                        {recipientsToConfirm.length !== 1 ? "s" : ""}:
                    </p>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="py-3 font-semibold">
                                        Name
                                    </TableHead>
                                    <TableHead className="py-3 font-semibold">
                                        Email
                                    </TableHead>
                                    {recipientType === "employers" && (
                                        <TableHead className="py-3 font-semibold">
                                            Organization
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recipientsToConfirm.map((recipient, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{recipient.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {recipient.email}
                                        </TableCell>
                                        {recipientType === "employers" && (
                                            <TableCell>
                                                {recipient.organization || "-"}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsConfirmationOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmedSend}>
                        Confirm & Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationDialog;
