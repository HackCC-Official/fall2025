import PanelLayout from "../layout";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function EmailPage() {
    return (
        <div className="relative isolate">
            {/* Background gradient */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="py-24 sm:py-32 relative z-10">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                            HackCC Email System
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Built for the Outreach Team
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-[0.03] pointer-events-none" />
                                <div className="relative z-10">
                                    <CardHeader>
                                        <CardTitle>Manage Contacts</CardTitle>
                                        <CardDescription>
                                            Import or manually add contacts to
                                            your database. Keep track of all
                                            your professional connections.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href="/contacts">
                                                View Contacts
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </div>
                            </Card>

                            <Card className="relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-[0.03] pointer-events-none" />
                                <div className="relative z-10">
                                    <CardHeader>
                                        <CardTitle>Send Emails</CardTitle>
                                        <CardDescription>
                                            Compose and send professional emails
                                            using our pre-built templates. Reach
                                            out to multiple contacts at once.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href="/compose">
                                                Compose Email
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </div>
                            </Card>

                            <Card className="relative overflow-hidden sm:col-span-2 lg:col-span-1">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-teal-100 opacity-[0.03] pointer-events-none" />
                                <div className="relative z-10">
                                    <CardHeader>
                                        <CardTitle>Track Responses</CardTitle>
                                        <CardDescription>
                                            Monitor email delivery and response
                                            status. Stay on top of your
                                            communications.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href="/panel/email/inbox">
                                                View Inbox
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background gradient */}
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
        </div>
    );
}

EmailPage.getLayout = (page: React.ReactElement) => (
    <PanelLayout>{page}</PanelLayout>
);
