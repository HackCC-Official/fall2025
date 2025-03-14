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
        first_name: z.string().min(1, "First name is required"),
        last_name: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        domain_name: z.string().optional(),
        organization: z.string().min(1, "Organization is required"),
        country: z.string().optional(),
        state: z.string().optional(),
        city: z.string().optional(),
        postal_code: z.string().optional(),
        street: z.string().optional(),
        confidence_score: z.number({
            required_error: "Confidence score is required",
        }),
        type: z.enum(["sponsor", "partner", "personal", "other"]).optional(),
        number_of_sources: z.number().optional(),
        pattern: z.string().optional(),
        department: z.string().optional(),
        position: z.string().min(1, "Position is required"),
        twitter_handle: z.string().optional(),
        linkedin_url: z
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
        company_type: z.string().optional(),
        industry: z.string().optional(),
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
            first_name: "",
            last_name: "",
            email: "",
            domain_name: "",
            organization: "",
            country: "",
            state: "",
            city: "",
            postal_code: "",
            street: "",
            confidence_score: undefined,
            type: undefined,
            number_of_sources: undefined,
            pattern: "",
            department: "",
            position: "",
            twitter_handle: "",
            linkedin_url: "",
            phone_number: "",
            company_type: "",
            industry: "",
        },
    });

    const onSubmit = async (values: ContactFormValues) => {
        setIsSubmitting(true);
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

            if (typeof cleanedValues.email === "string") {
                cleanedValues.domain_name = cleanedValues.email.split("@")[1];
            }

            const contactData: Partial<ContactDto> = {
                ...Object.fromEntries(
                    Object.entries(cleanedValues).map(([key, value]) => [
                        key,
                        key === "confidence_score"
                            ? Number(value)
                            : String(value),
                    ])
                ),
                type: (cleanedValues.type as string) || "other",
            };

            await createContact(contactData);
            await queryClient.invalidateQueries({ queryKey: ["contacts"] });
            form.reset();
            onOpenChange(false);
        } catch (err) {
            console.error("Failed to create contact:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to create contact. Please try again.";
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name *</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name *</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
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
                                name="organization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organization</FormLabel>
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
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="sponsor">
                                                    Sponsor
                                                </SelectItem>
                                                <SelectItem value="partner">
                                                    Partner
                                                </SelectItem>
                                                <SelectItem value="personal">
                                                    Personal
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Other
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
                                name="linkedin_url"
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
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
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="postal_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
