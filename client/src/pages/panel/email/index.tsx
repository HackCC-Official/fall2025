"use client";

import * as React from "react";
import PanelLayout from "../layout";
import type { Mail } from "@/types/mail";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, Users, CircleUser, Settings } from "lucide-react";
import HackersMail from "./components/hackers-mail";
import AccountSwitcher from "./components/account-switcher";
import { Separator } from "@/components/ui/separator";
import MailComponent from "./components/mail";
import { useContacts } from "@/hooks/use-contacts";
import { useOutreachTeam } from "@/hooks/use-outreach-team";
import type { OutreachTeamDto } from "@/features/outreach/types/outreach-team";
import { LogoIcon } from "@/components/logo-icon";
import { useInterestedUsers } from "@/hooks/use-interested.user";
import type { InterestedUserDto } from "@/features/outreach/types/interested-users.dto";
import {
    getEmails,
    createOutreachTeamMember,
    updateOutreachTeamMember,
    deleteOutreachTeamMember,
} from "@/features/outreach/api/outreach";
import type { SendEmailDto } from "@/features/outreach/types/email.dto";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const HACKER_SAMPLE_DATA: Mail[] = [];

// Form schema for outreach team member
const outreachTeamSchema = z.object({
    id: z.string().optional(),
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    major: z.string().min(1, "Major is required"),
    year: z.enum(["Freshman", "Sophomore", "Junior", "Senior", "Graduate"], {
        errorMap: () => ({
            message:
                "Invalid year. Must be one of: Freshman, Sophomore, Junior, Senior, Graduate",
        }),
    }),
    school: z.string().min(1, "School is required"),
    position: z.string().min(1, "Position is required"),
});

type OutreachTeamFormValues = z.infer<typeof outreachTeamSchema>;

export default function EmailPage() {
    const [defaultLayout] = React.useState(() => {
        if (typeof window !== "undefined") {
            const layout = localStorage.getItem(
                "react-resizable-panels:layout:mail"
            );
            return layout ? JSON.parse(layout) : [20, 32, 48];
        }
        return [20, 32, 48];
    });

    // Fetch contacts, outreach team, and interested users data
    const { data: contactsResponse, isLoading: isLoadingContacts } =
        useContacts();
    const {
        data: outreachTeamResponse,
        isLoading: isLoadingOutreachTeam,
        refetch: refetchOutreachTeam,
    } = useOutreachTeam();
    const {
        data: interestedUsersResponse,
        isLoading: isLoadingInterestedUsers,
    } = useInterestedUsers();
    const contactsArray = contactsResponse?.data || [];

    // Fetch emails
    const [emails, setEmails] = React.useState<SendEmailDto[]>([]);
    const [isLoadingEmails, setIsLoadingEmails] = React.useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [editingMember, setEditingMember] =
        React.useState<OutreachTeamDto | null>(null);
    const [showForm, setShowForm] = React.useState<boolean>(false);

    // Function to properly close the modal and reset state
    const closeModal = () => {
        setIsModalOpen(false);
        setShowForm(false);
        setEditingMember(null);
    };

    // Form for creating/editing outreach team members
    const form = useForm<OutreachTeamFormValues>({
        resolver: zodResolver(outreachTeamSchema),
        defaultValues: {
            id: "",
            email: "",
            name: "",
            major: "",
            school: "",
            position: "",
        },
        mode: "onChange",
    });

    // Log form errors when they occur
    React.useEffect(() => {
        const subscription = form.formState.errors;
        console.log("Form validation errors:", subscription);
        return () => {
            // No cleanup needed
        };
    }, [form.formState.errors]);

    React.useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await getEmails();
                console.log("Emails loaded from index:", response);
                setEmails(response);
            } catch (error) {
                console.error("Error fetching emails:", error);
            } finally {
                setIsLoadingEmails(false);
            }
        };

        fetchEmails();
    }, []);

    // Reset form when editing a new member
    React.useEffect(() => {
        if (editingMember) {
            form.reset({
                id: editingMember.id || "",
                email: editingMember.email || "",
                name: editingMember.name || "",
                major: editingMember.major || "",
                year: editingMember.year || "",
                school: editingMember.school || "",
                position: editingMember.position || "",
            });
        }
    }, [editingMember, form]);

    // Handle modal open/close
    React.useEffect(() => {
        if (!isModalOpen) {
            // Reset form state when modal closes
            setShowForm(false);
            setEditingMember(null);
        }
    }, [isModalOpen]);

    console.log("Outreach Team Response:", outreachTeamResponse);
    console.log("Interested Users Response:", interestedUsersResponse);

    const allAccounts = React.useMemo(() => {
        const outreachTeamArray = outreachTeamResponse?.data?.data || [];
        return outreachTeamArray.map((member: OutreachTeamDto) => ({
            label: member.name,
            email: member.email,
            id: member.id || member.email,
            icon: <CircleUser />,
        }));
    }, [outreachTeamResponse]);

    const interestedUsersMails = React.useMemo(() => {
        const interestedUsers = interestedUsersResponse || [];
        console.log("Interested Users being transformed:", interestedUsers);
        const mails = interestedUsers.map(
            (user: InterestedUserDto): Mail => ({
                id: user.email,
                from: user.email,
                to: [
                    {
                        email: user.email,
                        name: user.email,
                    },
                ],
                subject: user.email,
                html: user.email,
                date: user.created_at,
                read: false,
                labels: ["interested"],
            })
        );
        console.log("Transformed mails:", mails);
        return mails;
    }, [interestedUsersResponse]);

    const [selectedAccount, setSelectedAccount] = React.useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("selectedOutreachAccount") || "";
        }
        return "";
    });

    const handleAccountChange = React.useCallback((email: string) => {
        setSelectedAccount(email);
        localStorage.setItem("selectedOutreachAccount", email);
    }, []);

    const filteredEmails = React.useMemo(() => {
        return emails.filter((email) => {
            return selectedAccount ? email.from === selectedAccount : true;
        });
    }, [emails, selectedAccount]);

    const handleEditMember = (member: OutreachTeamDto) => {
        setEditingMember(member);
        setShowForm(true);
        setIsModalOpen(true);
    };

    const handleAddNewMember = () => {
        setEditingMember(null);
        setShowForm(true);
    };

    const handleDeleteMember = async (id: string) => {
        try {
            await deleteOutreachTeamMember(id);
            toast.success("Team member deleted successfully");
            refetchOutreachTeam();
        } catch (error) {
            console.error("Error deleting team member:", error);
            toast.error("Failed to delete team member");
        }
    };

    const onSubmit = async (data: OutreachTeamFormValues) => {
        try {
            if (editingMember) {
                console.log(
                    "Updating member with ID:",
                    editingMember.id || editingMember.email
                );

                // Create update data without the id property
                const updateData = {
                    email: data.email,
                    name: data.name,
                    major: data.major,
                    year: data.year as
                        | "Freshman"
                        | "Sophomore"
                        | "Junior"
                        | "Senior"
                        | "Graduate",
                    school: data.school,
                    position: data.position,
                };

                console.log("Update data (without id):", updateData);

                await updateOutreachTeamMember(
                    editingMember.id || editingMember.email,
                    updateData
                );
                console.log("Member updated successfully");
                toast.success("Team member updated successfully");
            } else {
                // For new team members, omit the id as it will be generated by the database
                const memberData = {
                    email: data.email,
                    name: data.name,
                    major: data.major,
                    year: data.year as
                        | "Freshman"
                        | "Sophomore"
                        | "Junior"
                        | "Senior"
                        | "Graduate",
                    school: data.school,
                    position: data.position,
                };

                console.log("Creating new member:", memberData);
                await createOutreachTeamMember(memberData);
                console.log("Member created successfully");
                toast.success("New team member created successfully");
            }

            console.log("Refetching team data...");
            await refetchOutreachTeam();
            console.log("Team data refetched");
            closeModal();
        } catch (error) {
            console.error("Error saving team member:", error);
            toast.error("Failed to save team member");
        }
    };

    const handleCancel = () => {
        closeModal();
    };

    const manualSubmit = async () => {
        console.log("Manual submit triggered");
        const formData = form.getValues();
        console.log("Current form values:", formData);
        await onSubmit(formData);
    };

    if (
        isLoadingContacts ||
        isLoadingOutreachTeam ||
        isLoadingInterestedUsers ||
        isLoadingEmails
    ) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 bg-background h-screen">
                <div className="animate-spin">
                    <LogoIcon className="w-16 h-16" />
                </div>
                <p className="text-muted-foreground text-lg">
                    Crunching the latest data
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-background min-h-screen">
            <Tabs
                defaultValue="company"
                className="flex flex-col h-full min-h-0"
            >
                <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur pb-4 lg:pb-0 border-b">
                    <div className="lg:flex items-center gap-4 mx-auto lg:px-4 w-full max-w-[1400px] min-h-14">
                        <div className='flex gap-2 w-full'>
                            <AccountSwitcher
                                isCollapsed={false}
                                accounts={allAccounts}
                                onAccountChange={handleAccountChange}
                                defaultEmail={selectedAccount}
                            />
                            <Dialog
                                open={isModalOpen}
                                onOpenChange={(open) => {
                                    if (!open) {
                                        closeModal();
                                    } else {
                                        setIsModalOpen(true);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="ml-2 px-3 h-9"
                                    >
                                        <Settings className="mr-2 w-4 h-4" />
                                        <span>Settings</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Outreach Team Management
                                        </DialogTitle>
                                        <DialogDescription>
                                            View, add, or edit members of your
                                            outreach team.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="gap-6 grid">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-medium text-lg">
                                                Team Members
                                            </h3>
                                            <Button onClick={handleAddNewMember}>
                                                Add New Member
                                            </Button>
                                        </div>

                                        {showForm ? (
                                            <Form {...form}>
                                                <form
                                                    onSubmit={(e) => {
                                                        console.log(
                                                            "Form submit event triggered"
                                                        );
                                                        form.handleSubmit(onSubmit)(
                                                            e
                                                        );
                                                    }}
                                                    className="space-y-4"
                                                >
                                                    <div className="gap-4 grid grid-cols-2">
                                                        <FormField
                                                            control={form.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Email
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="email@example.com"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="name"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Name
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Full Name"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="major"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Major
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Computer Science"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="year"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        Year
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="e.g. Senior, Graduate, etc."
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="school"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>
                                                                        School
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="University Name"
                                                                            {...field}
                                                                        />
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
                                                                    <FormLabel>
                                                                        Position
                                                                    </FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            placeholder="Outreach Coordinator"
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={handleCancel}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                console.log(
                                                                    "Submit button clicked"
                                                                );
                                                                manualSubmit();
                                                            }}
                                                        >
                                                            {editingMember
                                                                ? "Update Member"
                                                                : "Create Member"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </Form>
                                        ) : (
                                            <div className="border rounded-md">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>
                                                                Name
                                                            </TableHead>
                                                            <TableHead>
                                                                Email
                                                            </TableHead>
                                                            <TableHead>
                                                                Position
                                                            </TableHead>
                                                            <TableHead>
                                                                School
                                                            </TableHead>
                                                            <TableHead>
                                                                Actions
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {outreachTeamResponse?.data?.data?.map(
                                                            (
                                                                member: OutreachTeamDto
                                                            ) => (
                                                                <TableRow
                                                                    key={
                                                                        member.id ||
                                                                        member.email
                                                                    }
                                                                >
                                                                    <TableCell className="font-medium">
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            member.email
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            member.position
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            member.school
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex space-x-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleEditMember(
                                                                                        member
                                                                                    )
                                                                                }
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDeleteMember(
                                                                                        member.id ||
                                                                                            member.email
                                                                                    )
                                                                                }
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <Separator orientation="vertical" className="hidden lg:block h-6" />
                        <nav className="flex-1 mt-4 lg:mt-0">
                            <TabsList className="inline-flex justify-start items-center bg-muted p-1 rounded-lg h-9">
                                <TabsTrigger
                                    value="company"
                                    className="gap-2 px-3"
                                >
                                    <Building2 className="w-4 h-4" />
                                    <span>Company Mail</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="hackers"
                                    className="gap-2 px-3"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Hackers List</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="interested"
                                    className="gap-2 px-3"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Interested Hackers</span>
                                </TabsTrigger>
                            </TabsList>
                        </nav>
                    </div>
                </header>

                <main className="flex-1 min-h-0 overflow-hidden">
                    <TabsContent
                        value="company"
                        className="m-0 outline-none h-full"
                    >
                        <MailComponent
                            accounts={allAccounts}
                            mails={[]}
                            contacts={contactsArray}
                            defaultLayout={defaultLayout}
                            defaultCollapsed={false}
                            navCollapsedSize={4}
                            emails={filteredEmails}
                            emailsCount={emails.length}
                        />
                    </TabsContent>
                    <TabsContent
                        value="hackers"
                        className="m-0 outline-none h-full"
                    >
                        <HackersMail
                            mails={HACKER_SAMPLE_DATA}
                            title="Registered Hackers"
                            description="Manage and communicate with registered participants"
                            type="registered"
                        />
                    </TabsContent>
                    <TabsContent
                        value="interested"
                        className="m-0 outline-none h-full"
                    >
                        <HackersMail
                            mails={interestedUsersMails}
                            title="Interested Hackers"
                            description="Manage and communicate with interested participants"
                            type="interested"
                        />
                    </TabsContent>
                </main>
            </Tabs>
        </div>
    );
}

EmailPage.getLayout = (page: React.ReactNode) => (
    <PanelLayout>{page}</PanelLayout>
);
