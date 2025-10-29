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
import { updateContact } from "@/features/outreach/api/outreach";
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

interface EditContactDrawerProps {
    contact?: ContactDto;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const contactFormSchema = z.object({
    contact_name: z.string().min(1, "Name is required"),
    email_address: z.string().email("Invalid email address"),
    company: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    street: z.string().optional(),
    confidence_score: z.number({
        required_error: "Confidence score is required",
    }),
    position: z.string().optional(),
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
                message: "Please enter a valid LinkedIn URL or leave it empty",
            }
        )
        .optional(),
    phone_number: z.string().optional(),
    website: z.string().optional(),
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
});

type FormSchema = z.infer<typeof contactFormSchema>;

export default function EditContactDrawer({
    contact,
    open,
    onOpenChange,
}: EditContactDrawerProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const queryClient = useQueryClient();
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        console.log("EditContactDrawer rendered, open:", open);
    }, [open]);

    const form = useForm<FormSchema>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            contact_name: contact?.contact_name || "",
            email_address: contact?.email_address || "",
            company: contact?.company || "",
            country: contact?.country || "",
            confidence_score: contact?.confidence_score,
            position: contact?.position || "",
            linkedin: contact?.linkedin || "",
            phone_number: contact?.phone_number || "",
            website: contact?.website || "",
            liaison: contact?.liaison || "",
            status: contact?.status || "Cold",
            meeting_method: contact?.meeting_method || "",
        },
    });

    if (!contact) {
        return null;
    }

    const handleSubmit = async (values: FormSchema) => {
        console.log("Form submitted with values:", values);
        setIsSubmitting(true);
        setError(null);

        try {
            const contactData: Partial<ContactDto> = {
                ...values,
                confidence_score: values.confidence_score,
            };

            console.log("Status value:", contactData.status);

            console.log("Updating contact with data:", contactData);
            await updateContact(contact!.id.toString(), contactData);
            console.log("Contact updated successfully");
            await queryClient.invalidateQueries({ queryKey: ["contacts"] });
            onOpenChange(false);
        } catch (err) {
            console.error("Failed to update contact:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to update contact. Please try again.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Edit Contact</SheetTitle>
                    <SheetDescription>
                        Make changes to the contact information here.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((values) => {
                            console.log(
                                "Form submit event triggered with values:",
                                values
                            );
                            handleSubmit(values);
                        })}
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
                                    <FormLabel>Name *</FormLabel>
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
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                        </div>

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
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={() => handleSubmit(form.getValues())}
                            >
                                {isSubmitting ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
}
