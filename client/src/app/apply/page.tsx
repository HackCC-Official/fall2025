 
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { Logo } from "@/components/logo";
import { SkyFixed } from "@/components/sky";
import { FileUploader } from "@/components/ui/file-uploader";
import { ApplicationInput, ApplicationCalendar, ApplicationTextarea } from "@/features/application/components/application-input";
import { ApplicationLabel } from "@/features/application/components/application-label";
import { ApplicationMultipleGroup, ApplicationMultipleItem } from "@/features/application/components/application-multiple";
import { ApplicationSelect } from "@/features/application/components/application-select";
import { FormCard } from "@/features/application/components/form-card";
import schools from '@/features/application/data/schools.json';
import residences from '@/features/application/data/residences.json';
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/features/question/api/question";
import { QuestionResponseDto } from "@/features/question/types/question-response.dto";
import { QuestionType } from "@/features/question/types/question-type.enum";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApplicationRequestDTO } from "@/features/application/types/application";
import { ApplicationStatus } from "@/features/application/types/status.enum";
import { createApplication, Document, getApplicationByUserId } from "@/features/application/api/application";
import { User } from "@supabase/supabase-js";
import { DarkCard } from "@/components/dark-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface QuestionGroupNode {
    type: 'GROUP';
    questions: QuestionResponseDto[];
    isSingleLabel: boolean;
    label: string;
}

interface QuestionNode {
    type: 'NODE';
    question: QuestionResponseDto;
}

type QuestionNodes = QuestionNode | QuestionGroupNode;

interface FormValues {
    [key: string]: string | number | File | null; // Dynamic form values
}

export default function ApplyPage() {
    const [user, setUser] = useState<User | null>(null);
    const supabase = getBrowserClient()
    const router = useRouter();
    const [authCheck, setAuthChecked] = useState(false);

    const [applicationQuery, questionQuery] = useQueries({
        queries: [
            {
                queryKey: ['application-user', user ? user.id : ''],
                queryFn: () => getApplicationByUserId(user ? user.id : ''),
                enabled: () => !!(user && user.id)
            },
            {
                queryKey: ['questions'],
                queryFn: () => getQuestions()
            }
        ]
    })

    const applicationMutation = useMutation({
        mutationFn: (
            { 
            applicationDTO, 
            document 
            } 
            : 
            { 
                applicationDTO: ApplicationRequestDTO, 
                document: Document 
            }
            ) => 
                createApplication(applicationDTO, document)
    })

    const { control, handleSubmit } = useForm<FormValues>();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/register');
            } else {
                setAuthChecked(true);
                setUser(session.user)
            }
        };

        checkAuth();
    }, [router, supabase.auth]);

    if (!authCheck || applicationQuery.isLoading || questionQuery.isLoading) {
        return (
            <div className="relative w-screen h-screen overflow-x-hidden">
                <SkyFixed />
            </div>
        );
    }

    if (applicationQuery && applicationQuery.data && applicationQuery.data.status === ApplicationStatus.SUBMITTED) {
        return (
            <div className="relative w-screen h-screen overflow-x-hidden">
                <SkyFixed />
                <div className="flex flex-col justify-center items-center mx-auto mt-24 md:mt-16 2xl:mt-20 xl:mt-16 text-white">
                    <div className="relative flex">
                        <Logo />
                    </div>
                    <div className="z-10 flex sm:flex-row flex-col mt-4 mb-8 lg:mb-12 xl:mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center md:md-8">
                        <p>2025 Application</p>
                    </div>
                    <DarkCard className="flex flex-col items-center 2xl:p-20 xl:p-16 w-[350px] sm:w-[350px] md:w-[700px] lg:w-[800px] xl:w-[1080px]">
                        <h1 className="font-bagel 2xl:text-[40px] xl:text-[36px] text-2xl">Thank you for Applying!</h1>
                        <div className="inline-block bg-white mt-8 md:mt-8 lg:mt-10 xl:mt-12 p-10 rounded-2xl text-[#696E75] text-sm md:text-base lg:text-lg xl:text-xl">
                            Application Status: <span className="block md:inline font-semibold text-[#4C27A0] text-base md:text-base lg:text-lg xl:text-xl">Under Review</span>
                        </div>
                    </DarkCard>
                </div>
            </div>
        )
    }

    const nodes: QuestionNodes[] = questionQuery.data ? questionQuery.data.reduce<QuestionNodes[]>((prev, curr) => {
        if (curr.group) {
            const groupNodeIndex = prev.findIndex(n => n.type === 'GROUP' && n.label === curr.group);
            if (groupNodeIndex === -1) {
                prev.push({
                    type: "GROUP",
                    isSingleLabel: curr.isSingleLabel,
                    label: curr.group,
                    questions: [curr]
                });
            } else {
                (prev[groupNodeIndex] as QuestionGroupNode).questions.push(curr);
            }
        } else {
            prev.push({
                type: 'NODE',
                question: curr
            });
        }
        return prev;
    }, []) : [];

    const onSubmit = async (values: FormValues) => {
        const document: Document = {
            resume: undefined,
            transcript: undefined
        }
        const application: ApplicationRequestDTO = {
            userId: user?.id || '',
            status: ApplicationStatus.SUBMITTED,
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            school: "",
            submissions: [],
        };
        if (values && questionQuery.data) {
            Object.entries(values).forEach(([key, value]) => {
                const question = questionQuery.data.find(q => q.id === Number(key.split('_')[1])) as QuestionResponseDto;
                if (question?.isApplicationField) {
                    // Assign the value to the application field
                    switch (question.applicationField) {
                        case "firstName":
                        case "lastName":
                        case "email":
                        case "phoneNumber":
                        case "school":
                            application[question.applicationField] = String(value);
                            break;
                        case "status":
                            application.status = ApplicationStatus.SUBMITTED; // Default status
                            break;
                        case "transcript":
                            console.log("HEY", value)
                            document.transcript = (value as unknown as File[])[0]
                            break;
                        case "resume":
                            document.resume = (value as unknown as File[])[0];
                            break;
                        default:
                            break;
                    }
                } else {
                    application.submissions.push({
                        questionId: Number(key.split('_')[1]),
                        answer: String(value)
                    });
                }
            });

            console.log(document)
            // Submit to your API here
            const response = await applicationMutation.mutateAsync({ 
                applicationDTO: application, 
                document
            })
            console.log(response)
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-x-hidden">
            <SkyFixed />
            <div className="flex flex-col justify-center items-center mx-auto mt-24 text-white">
                <div className="relative flex">
                    <Logo />
                </div>
                <div className="z-10 flex sm:flex-row flex-col mt-4 mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center">
                    <p>2025 Application</p>
                </div>
            </div>
            <FormCard className="p-4 md:p-16 font-mont">
                <h1 className="font-bagel md:text-[2rem] text-xl text-center">Thank you for Applying!</h1>
                <p className="mt-2 md:mt-4 px-4 md:px-20 font-semibold text-muted-foreground text-xs md:text-sm text-center">
                    Please tell us a little about you, your team and the project you have in mind to work on. Our team will collect applications from March 10 - April 22, 2025.
                </p>
                <p className="mt-4 text-xs md:text-sm text-center italic">
                    All Fields Required
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 mt-8">
                    {nodes.map(n => 
                        n.type === 'NODE' ? (
                            <div key={n.question.id}>
                                <ApplicationLabel>{n.question.prompt}</ApplicationLabel>
                                <div className="mt-4">
                                    <Controller
                                        name={`question_${n.question.id}`}
                                        control={control}
                                        defaultValue=""
                                        render={({ field, fieldState: { error } }) => {
                                            switch (n.question.type) {
                                                case QuestionType.TEXT:
                                                    return (
                                                        <div>
                                                            <ApplicationInput {...field} placeholder={n.question.prompt} type="text" />
                                                            {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                        </div>
                                                    )
                                                case QuestionType.TEXTAREA:
                                                    return (
                                                        <div>
                                                            <ApplicationTextarea {...field} />
                                                            {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                        </div>
                                                    )
                                                case QuestionType.DATE:
                                                    return (
                                                        <div>
                                                            <ApplicationCalendar {...field} value={field.value as unknown as Date} />
                                                            {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                        </div>
                                                    )
                                                case QuestionType.FILE:
                                                    return (
                                                        <div>
                                                            <FileUploader
                                                                value={field.value as unknown as File[]} // Cast field.value to File[]
                                                                onValueChange={field.onChange} // Pass field.onChange directly
                                                                maxFileCount={1} // Allow only 1 file (or adjust as needed)
                                                                maxSize={1000000 * 25}
                                                            />
                                                            {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                        </div>
                                                    );
                                                case QuestionType.SELECT:
                                                    if (n.question.prompt === 'Your School') {
                                                        return (
                                                            <div>
                                                                <ApplicationSelect
                                                                    {...field}
                                                                    placeholder="School"
                                                                    value={String(field.value)}
                                                                    values={schools.map(s => s.institution)}
                                                                />
                                                                {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                            </div>
                                                        );
                                                    } else if (n.question.prompt === 'Your Residence') {
                                                        return (
                                                            <div>
                                                                <ApplicationSelect
                                                                    {...field}
                                                                    placeholder="residence"
                                                                    value={String(field.value)}
                                                                    values={residences.map(r => r.city)}
                                                                />
                                                                {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                            </div>
                                                        );
                                                    }
                                                    return <div>Unsupported question type</div>;
                                                case QuestionType.EMAIL:
                                                    return (
                                                        <div>
                                                            <ApplicationInput {...field} placeholder={n.question.prompt} type="email" />
                                                            {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                        </div>
                                                    );
                                                case QuestionType.MULTIPLE:
                                                    if (n.question.prompt === 'Gender') {
                                                        return (
                                                            <div>
                                                                <ApplicationMultipleGroup className="mt-4">
                                                                    {
                                                                        n.question.possibleAnswers
                                                                        &&
                                                                        n.question.possibleAnswers.map((p, i) => (
                                                                            <ApplicationMultipleItem key={'gender_' + i} id={'gender_' + i} {...field} value={p} />
                                                                        ))
                                                                    }
                                                                </ApplicationMultipleGroup>
                                                                {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                            </div>
                                                        );
                                                    } else if (n.question.prompt === 'Graduation Year') {
                                                        return (
                                                            <div>
                                                                <ApplicationMultipleGroup className="mt-4">
                                                                    {
                                                                        n.question.possibleAnswers
                                                                        &&
                                                                        n.question.possibleAnswers.map((p, i) => (
                                                                            <ApplicationMultipleItem key={'grad_year_' + i} id={'grad_year_' + i} {...field} value={p} />
                                                                        ))
                                                                    }
                                                                </ApplicationMultipleGroup>
                                                                {error && <p className="text-red-500 text-sm">{error.message}</p>}
                                                            </div>
                                                        );
                                                    }
                                                    return <div>Unsupported question type</div>;
                                                default:
                                                    return <div>Unsupported question type</div>;
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div key={n.questions[0].id}>
                                {!n.isSingleLabel && <ApplicationLabel>{n.label}</ApplicationLabel>}
                                <div className={cn([
                                    "flex gap-8",
                                    !n.isSingleLabel && 'mt-4'
                                ])}>
                                    {n.questions.map(q => (
                                        <div className="w-full" key={q.id}>
                                            {n.isSingleLabel && <ApplicationLabel>{q.prompt}</ApplicationLabel>}
                                            <div className={n.isSingleLabel ? 'mt-4' : ''}>
                                                <Controller
                                                    name={`question_${q.id}`}
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{ required: "This field is required" }}
                                                    render={({ field, fieldState: { error } }) => {
                                                        switch (q.type) {
                                                            case QuestionType.TEXT:
                                                                return (
                                                                    <div>
                                                                        <ApplicationInput {...field} placeholder={q.prompt} type="text" />
                                                                        {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                    </div>
                                                                )
                                                            case QuestionType.TEXTAREA:
                                                                return (
                                                                    <div>
                                                                        <ApplicationTextarea {...field} />
                                                                        {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                    </div>
                                                                )
                                                            case QuestionType.DATE:
                                                                return <ApplicationCalendar {...field} value={field.value as unknown as Date} />;
                                                            case QuestionType.FILE:
                                                                return (
                                                                    <div>
                                                                        <FileUploader
                                                                            value={field.value as unknown as File[]} // Cast field.value to File[]
                                                                            onValueChange={field.onChange} // Pass field.onChange directly
                                                                            maxFileCount={1} // Allow only 1 file (or adjust as needed)
                                                                            maxSize={1000000 * 25}
                                                                        />
                                                                        {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                    </div>
                                                                );
                                                            case QuestionType.SELECT:
                                                                if (q.prompt === 'Your School') {
                                                                    return (
                                                                        <div>
                                                                            <ApplicationSelect
                                                                                {...field}
                                                                                placeholder="School"
                                                                                value={String(field.value)}
                                                                                values={schools.map(s => s.institution)}
                                                                            />
                                                                            {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                        </div>
                                                                    );
                                                                } else if (q.prompt === 'Your Residence') {
                                                                    return (
                                                                        <div>
                                                                            <ApplicationSelect
                                                                                {...field}
                                                                                placeholder="residence"
                                                                                value={String(field.value)}
                                                                                values={residences.map(r => r.city)}
                                                                            />
                                                                            {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                        </div>

                                                                    );
                                                                }
                                                                return <div>Unsupported question type</div>;
                                                            case QuestionType.EMAIL:
                                                                return (
                                                                    <div>
                                                                        <ApplicationInput {...field} placeholder={q.prompt} type="email" />
                                                                        {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                    </div>
                                                                );
                                                            case QuestionType.MULTIPLE:
                                                                if (q.prompt === 'Gender') {
                                                                    return (
                                                                        <div>
                                                                            <ApplicationMultipleGroup className="mt-4">
                                                                                {
                                                                                    q.possibleAnswers
                                                                                    &&
                                                                                    q.possibleAnswers.map((p, i) => (
                                                                                        <ApplicationMultipleItem key={'gender_' + i} id={'gender_' + i} {...field} value={p} />
                                                                                    ))
                                                                                }
                                                                            </ApplicationMultipleGroup>
                                                                            {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                        </div>
                                                                    );
                                                                } else if (q.prompt === 'Graduation Year') {
                                                                    return (
                                                                        <ApplicationMultipleGroup className="mt-4">
                                                                            {
                                                                                q.possibleAnswers
                                                                                &&
                                                                                q.possibleAnswers.map((p, i) => (
                                                                                    <ApplicationMultipleItem key={'grad_year_' + i} id={'grad_year_' + i} {...field} value={p} />
                                                                                ))
                                                                            }
                                                                            {error && <p className="mt-4 text-red-500 text-sm">{error.message}</p>}
                                                                        </ApplicationMultipleGroup>
                                                                    );
                                                                }
                                                                return <div>Unsupported question type</div>;
                                                            default:
                                                                return <div>Unsupported question type</div>;
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                    <div className="flex justify-end">
                        <Button className="bg-lightpurple hover:bg-royalpurple p-8 font-mont font-semibold">
                            Submit Application
                        </Button>
                    </div>
                </form>
            </FormCard>
        </div>
    );
}