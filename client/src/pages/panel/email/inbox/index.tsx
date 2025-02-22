import PanelLayout from "../../layout";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Email, Contact } from "@/lib/email/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const MOCK_EMAILS: (Email & { recipients: Contact[] })[] = [
    {
        id: "1",
        templateId: "1",
        subject: "Thank you for sponsoring HackCC 2024",
        content: "Dear John,\n\nI hope this email finds you well...",
        recipients: [
            {
                id: "1",
                name: "John Doe",
                email: "john@example.com",
                company: "Acme Inc",
                phone: "+1234567890",
                linkedIn: "https://linkedin.com/in/johndoe",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ],
        sentAt: new Date(),
        status: "delivered",
        replyStatus: "pending",
    },
    // Add more mock emails as needed
];

export default function InboxPage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [companyFilter, setCompanyFilter] = React.useState("all");
    const [selectedEmail, setSelectedEmail] = React.useState<
        (typeof MOCK_EMAILS)[0] | null
    >(null);

    const filteredEmails = React.useMemo(() => {
        return MOCK_EMAILS.filter((email) => {
            const matchesSearch = email.subject
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesCompany =
                companyFilter === "all" || !companyFilter
                    ? true
                    : email.recipients.some((recipient) =>
                          recipient.company
                              .toLowerCase()
                              .includes(companyFilter.toLowerCase())
                      );
            return matchesSearch && matchesCompany;
        });
    }, [searchTerm, companyFilter]);

    const uniqueCompanies = React.useMemo(() => {
        const companies = new Set<string>();
        MOCK_EMAILS.forEach((email) => {
            email.recipients.forEach((recipient) => {
                companies.add(recipient.company);
            });
        });
        return Array.from(companies);
    }, []);

    return (
        <div className="mx-auto py-10 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-semibold text-3xl tracking-tight">Inbox</h1>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        Mark all as read
                    </Button>
                    <Button variant="outline" size="sm">
                        Export
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search" className="sr-only">
                                    Search emails
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="search"
                                        placeholder="Search emails..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                    <svg
                                        className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-[200px]">
                                <Label
                                    htmlFor="company-filter"
                                    className="sr-only"
                                >
                                    Filter by company
                                </Label>
                                <Select
                                    value={companyFilter}
                                    onValueChange={setCompanyFilter}
                                >
                                    <SelectTrigger
                                        id="company-filter"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Filter by company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Companies
                                        </SelectItem>
                                        {uniqueCompanies.map((company) => (
                                            <SelectItem
                                                key={company}
                                                value={company}
                                            >
                                                {company}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[120px]">
                                        Date
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">
                                        Subject
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">
                                        Recipients
                                    </TableHead>
                                    <TableHead className="w-[120px]">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[120px]">
                                        Reply Status
                                    </TableHead>
                                    <TableHead className="w-[100px] text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmails.map((email) => (
                                    <TableRow
                                        key={email.id}
                                        className="hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            {email.sentAt.toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{email.subject}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {email.recipients
                                                .map((r) => r.name)
                                                .join(", ")}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    email.status === "delivered"
                                                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                        : email.status ===
                                                            "sent"
                                                          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                                                          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                                                }`}
                                            >
                                                {email.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    email.replyStatus ===
                                                    "replied"
                                                        ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                        : email.replyStatus ===
                                                            "pending"
                                                          ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                                                          : "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
                                                }`}
                                            >
                                                {email.replyStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedEmail(email)
                                                }
                                                className="hover:bg-muted"
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog
                    open={!!selectedEmail}
                    onOpenChange={() => setSelectedEmail(null)}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-semibold text-xl tracking-tight">
                                {selectedEmail?.subject}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="gap-1 grid">
                                <h4 className="font-medium text-sm">
                                    Recipients
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                    {selectedEmail?.recipients
                                        .map((r) => `${r.name} (${r.company})`)
                                        .join(", ")}
                                </p>
                            </div>
                            <div className="gap-1 grid">
                                <h4 className="font-medium text-sm">Sent</h4>
                                <p className="text-muted-foreground text-sm">
                                    {selectedEmail?.sentAt.toLocaleString()}
                                </p>
                            </div>
                            <div className="gap-1 grid">
                                <h4 className="font-medium text-sm">Content</h4>
                                <div className="bg-muted/50 p-4 border rounded-lg text-sm whitespace-pre-wrap">
                                    {selectedEmail?.content}
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="gap-1.5 grid">
                                    <span className="font-medium text-sm">
                                        Delivery Status
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            selectedEmail?.status ===
                                            "delivered"
                                                ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                : selectedEmail?.status ===
                                                    "sent"
                                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                                                  : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                                        }`}
                                    >
                                        {selectedEmail?.status}
                                    </span>
                                </div>
                                <div className="gap-1.5 grid">
                                    <span className="font-medium text-sm">
                                        Reply Status
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            selectedEmail?.replyStatus ===
                                            "replied"
                                                ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                : selectedEmail?.replyStatus ===
                                                    "pending"
                                                  ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                                                  : "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
                                        }`}
                                    >
                                        {selectedEmail?.replyStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

InboxPage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
