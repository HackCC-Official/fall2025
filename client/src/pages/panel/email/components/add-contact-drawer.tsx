import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import type { ContactDto } from "@/features/outreach/types/contact.dto";
import { createContact } from "@/features/outreach/api/outreach";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddContactDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const contactFormSchema = z
    .object({
        contact_name: z.string().min(1, "Name is required"),
        email_address: z.string().email("Invalid email address"),
        company: z.string().optional(),
        country: z.string().optional(),
        position: z.string().optional(),
        confidence_score: z.number().min(0).max(100).optional(),
        linkedin: z
            .string()
            .refine(
                (val) => {
                    if (!val) return true; // Empty string is valid
                    try {
                        new URL(val);
                        return val.includes("linkedin.com");
                    } catch {
                        return false;
                    }
                },
                {
                    message:
                        "Please enter a valid LinkedIn URL or leave it empty",
                }
            )
            .optional(),
        phone_number: z.string().optional(),
        website: z
            .string()
            .url("Please enter a valid URL")
            .optional()
            .or(z.literal("")),
        liaison: z.string().optional(),
        status: z
            .enum([
                "Cold",
                "Follow Up 1",
                "Follow Up 2",
                "Accept",
                "Rejected",
                "Contacted",
            ])
            .optional(),
        meeting_method: z.string().optional(),
    })
    .transform((data) => {
        const cleaned = { ...data } as unknown as Record<
            string,
            string | number
        >;
        Object.keys(cleaned).forEach((key) => {
            if (cleaned[key] === "") {
                delete cleaned[key];
            }
        });
        return cleaned;
    });

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function AddContactDrawer({
    open,
    onOpenChange,
}: AddContactDrawerProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const queryClient = useQueryClient();
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            contact_name: "",
            email_address: "",
            company: "",
            country: "",
            position: "",
            confidence_score: undefined,
            linkedin: "",
            phone_number: "",
            website: "",
            liaison: "",
            status: undefined,
            meeting_method: "",
        },
    });

    const onSubmit = async (values: ContactFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const entries = Object.entries(values).filter(([, value]) => {
                if (typeof value === "string") return value.trim() !== "";
                if (typeof value === "number") return !isNaN(value);
                return false;
            });

            const cleanedValues = entries.reduce(
                (acc, [key, value]) => {
                    if (typeof value === "string") {
                        acc[key] = value.trim();
                    } else if (typeof value === "number" && !isNaN(value)) {
                        acc[key] = value;
                    }
                    return acc;
                },
                {} as Record<string, string | number>
            );

            const contactData: Partial<ContactDto> = {
                ...Object.fromEntries(
                    Object.entries(cleanedValues).map(([key, value]) => [
                        key,
                        key === "confidence_score"
                            ? Number(value)
                            : String(value),
                    ])
                ),
            };

            await createContact(contactData);
            await queryClient.invalidateQueries({ queryKey: ["contacts"] });
            form.reset();
            onOpenChange(false);
        } catch (err) {
            console.error("Failed to create contact:", err);
            let errorMessage = "Failed to create contact. Please try again.";

            // Handle structured API error responses
            if (err && typeof err === "object") {
                if (
                    "error" in err &&
                    typeof err.error === "object" &&
                    err.error &&
                    "message" in err.error
                ) {
                    // Structure: { error: { message: string } }
                    errorMessage = String(err.error.message);
                } else if ("message" in err) {
                    // Structure: { message: string }
                    errorMessage = String(err.message);
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Add New Contact</SheetTitle>
                    <SheetDescription>
                        Add a new contact to your database. Fill in the required
                        fields and any additional information.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 mt-6"
                    >
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="contact_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="confidence_score"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confidence Score</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                        ? parseInt(
                                                              e.target.value
                                                          )
                                                        : undefined;
                                                    field.onChange(value);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Cold">
                                                    Cold
                                                </SelectItem>
                                                <SelectItem value="Follow Up 1">
                                                    Follow Up 1
                                                </SelectItem>
                                                <SelectItem value="Follow Up 2">
                                                    Follow Up 2
                                                </SelectItem>
                                                <SelectItem value="Accept">
                                                    Accept
                                                </SelectItem>
                                                <SelectItem value="Rejected">
                                                    Rejected
                                                </SelectItem>
                                                <SelectItem value="Contacted">
                                                    Contacted
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="linkedin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LinkedIn URL</FormLabel>
                                        <FormControl>
                                            <Input type="url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input type="url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="liaison"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Liaison</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="meeting_method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meeting Method</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Contact"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
