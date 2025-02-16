"use client";

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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import type { Contact, CSVContact } from "@/lib/email/types";
import { Card, CardContent } from "@/components/ui/card";
import PanelLayout from "../../layout";
import Papa, { ParseResult } from "papaparse";

// Mock data for demonstration
const MOCK_CONTACTS: Contact[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        company: "Acme Inc",
        role: "Software Engineer",
        phone: "+1234567890",
        linkedIn: "https://linkedin.com/in/johndoe",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        company: "Tech Corp",
        phone: "+1987654321",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // Add more mock contacts as needed
];

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    company: z.string().min(1, "Company is required"),
    role: z
        .string()
        .optional()
        .transform((val) => (val === "" ? undefined : val)),
    phone: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .pipe(
            z
                .string()
                .min(10, "Phone number must be at least 10 digits")
                .optional()
        ),
    linkedIn: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .pipe(z.string().url("Invalid LinkedIn URL").optional()),
    notes: z
        .string()
        .optional()
        .transform((val) => (val === "" ? undefined : val)),
});

export default function ContactsPage() {
    const [contacts, setContacts] = React.useState<Contact[]>(MOCK_CONTACTS);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof contactFormSchema>>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            company: "",
            role: "",
            phone: "",
            linkedIn: "",
            notes: "",
        },
    });

    const filteredContacts = React.useMemo(() => {
        return contacts.filter((contact) => {
            const searchString = searchTerm.toLowerCase();
            return (
                contact.name.toLowerCase().includes(searchString) ||
                contact.email.toLowerCase().includes(searchString) ||
                contact.company.toLowerCase().includes(searchString) ||
                (contact.role?.toLowerCase().includes(searchString) ?? false)
            );
        });
    }, [contacts, searchTerm]);

    const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
        // Clean up empty strings for optional fields
        const newContact: Contact = {
            id: Math.random().toString(36).substring(7),
            name: values.name,
            email: values.email,
            company: values.company,
            role: values.role || undefined,
            phone: values.phone || undefined,
            linkedIn: values.linkedIn || undefined,
            notes: values.notes || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setContacts((prev) => [...prev, newContact]);
        setIsDialogOpen(false);
        form.reset();
    };

    const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const processCSVFile = () => {
        if (!selectedFile) return;

        Papa.parse<CSVContact>(selectedFile, {
            header: true,
            complete: (results: ParseResult<CSVContact>) => {
                const newContacts = results.data.map((contact: CSVContact) => ({
                    id: Math.random().toString(36).substring(7),
                    ...contact,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
                setContacts((prev) => [...prev, ...newContacts]);
                setIsImportDialogOpen(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            },
            error: (error: Error) => {
                console.error("Error parsing CSV:", error);
                // TODO: Add error handling UI
            },
        });
    };

    return (
        <div className="mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="font-semibold text-3xl tracking-tight">
                    Contacts
                </h1>
                <div className="flex items-center space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Contact</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Contact</DialogTitle>
                                <DialogDescription>
                                    Add a new contact to your database
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Acme Inc."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Role (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Software Engineer"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Phone (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+1 (555) 000-0000"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="linkedIn"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    LinkedIn (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://linkedin.com/in/johndoe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Notes (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <textarea
                                                        className="flex bg-background disabled:opacity-50 px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full min-h-[80px] placeholder:text-muted-foreground text-sm disabled:cursor-not-allowed"
                                                        placeholder="Add any additional notes..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Add Contact</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={isImportDialogOpen}
                        onOpenChange={(open) => {
                            setIsImportDialogOpen(open);
                            if (!open) {
                                setSelectedFile(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                }
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button variant="outline">Import CSV</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Import Contacts from CSV
                                </DialogTitle>
                                <DialogDescription>
                                    Upload a CSV file containing contact
                                    information. Make sure your CSV file has the
                                    required columns.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="bg-muted/50 p-4 border rounded-lg">
                                    <h4 className="mb-2 font-medium">
                                        Required CSV Columns:
                                    </h4>
                                    <div className="gap-2 grid grid-cols-2 text-sm">
                                        <div>
                                            <span className="font-medium text-primary">
                                                Required:
                                            </span>
                                            <ul className="mt-1 text-muted-foreground list-disc list-inside">
                                                <li>name</li>
                                                <li>email</li>
                                                <li>company</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <span className="font-medium text-primary">
                                                Optional:
                                            </span>
                                            <ul className="mt-1 text-muted-foreground list-disc list-inside">
                                                <li>role</li>
                                                <li>phone</li>
                                                <li>linkedIn</li>
                                                <li>notes</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="gap-2 grid">
                                    <Label htmlFor="csv-file">
                                        Select CSV File
                                    </Label>
                                    <Input
                                        id="csv-file"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleCSVUpload}
                                        ref={fileInputRef}
                                    />
                                    {selectedFile && (
                                        <p className="text-muted-foreground text-sm">
                                            Selected: {selectedFile.name}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsImportDialogOpen(false);
                                            setSelectedFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={processCSVFile}
                                        disabled={!selectedFile}
                                    >
                                        Process CSV
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Search contacts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>LinkedIn</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">
                                        {contact.name}
                                    </TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.company}</TableCell>
                                    <TableCell>{contact.role || "-"}</TableCell>
                                    <TableCell>
                                        {contact.phone || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {contact.linkedIn ? (
                                            <a
                                                href={contact.linkedIn}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 dark:text-blue-400"
                                            >
                                                Profile
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {contact.notes ? (
                                            <span
                                                className="block max-w-[200px] truncate"
                                                title={contact.notes}
                                            >
                                                {contact.notes}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

ContactsPage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
