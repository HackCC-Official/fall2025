 
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { getBrowserClient } from "@/features/auth/lib/supabase-client";
import { Logo } from "@/components/logo";
import { SkyFixed } from "@/components/sky";
import { ApplicationLabel } from "@/features/application/components/application-input";
import { FormCard } from "@/features/application/components/form-card";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
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
import { debounce } from "lodash";
import { Spinner } from "@/components/ui/spinner";
import { BackButton } from "@/features/application/components/back-btn";
import { FormValues, Question, QuestionGroupNode, QuestionNodes } from "@/features/application/components/question-node";

export default function ApplyPage() {
    const maxWordLength = 150;
    const maxCharLength = 900;
    const maxFileSize = 1000000 * 25

    const formRules = {
        required: "your response is required for this field.", // Basic required validation
        validate: {
            maxFileSize: (value: unknown) => {
                // Handle single file case
                if (value instanceof File) {
                    return value.size > maxFileSize 
                    ? "File size must be under 25 MB."
                    : true;
                }
                
                if (Array.isArray(value)) {
                    for (const file of value) {
                        if (file instanceof File && file.size > maxFileSize) {
                        return "File size must be under 25 MB.";
                        }
                    }
                }
                
                // Handle case where value might be a FileList
                if (value instanceof FileList) {
                    for (let i = 0; i < value.length; i++) {
                        if (value[i].size > maxFileSize) {
                        return "File size must be under 25 MB.";
                        }
                    }
                }
                
                return true;
            },
            maxLength: (value: File | string | number | null) => {
                if (typeof value === 'string')  {
                    if (debouncedLargerThanMaxWordLength(value)) {
                        return `only a maximum of ${maxWordLength} words or ${maxCharLength} characters are allowed.`
                    }
                }
                return true;
            }
        }
    }

    const queryClient = useQueryClient();
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
        ,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['application-user', user ? user.id : ''] })
        }
    })

    const { control, handleSubmit } = useForm<FormValues>({
        mode: 'onChange', // This enables validation on change
        reValidateMode: 'onChange', // This ensures re-validation happens on change
    });

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
                    <DarkCard className="relative flex flex-col items-center 2xl:p-20 xl:p-16 w-[350px] sm:w-[350px] md:w-[700px] lg:w-[800px] xl:w-[1080px]">
                        <BackButton className="top-[-3rem] left-[1rem] absolute">
                            Go back home
                        </BackButton>
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

            // Submit to your API here
            await applicationMutation.mutateAsync({ 
                applicationDTO: application, 
                document
            })
        }
    };

    function largerThanMaxWordLength(text: string) {
        if (text.length > maxCharLength) {
            return true;
        }
    
        const len = text.split(/[\s]+/);
        if(len.length > maxWordLength){
            return true;
        }

        return false;
    }

    const debouncedLargerThanMaxWordLength = debounce((value: string) => largerThanMaxWordLength(value), 500)

    return (
        <div className="relative w-screen h-screen overflow-x-hidden">
            <SkyFixed />
            {
                applicationMutation.status === 'pending' &&
                <div className="z-40 fixed inset-0 place-content-center grid bg-gray-400/60 h-screen">
                    <Spinner className="stroke-lightpurple w-40 h-40" />
                </div>
            }
            <div className="flex flex-col justify-center items-center mx-auto mt-24 text-white">
                <div className="relative flex">
                    <Logo />
                </div>
                <div className="z-10 flex sm:flex-row flex-col mt-4 mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center">
                    <p>2025 Application</p>
                </div>
            </div>
            <FormCard className="relative p-4 md:p-16 font-mont">
                <BackButton className="top-[-3rem] left-[1rem] absolute">
                    Not ready? Go back home
                </BackButton>
                <h1 className="font-bagel md:text-[2rem] text-xl text-center">Thank you for Applying!</h1>
                <p className="mt-2 md:mt-4 px-4 md:px-20 font-semibold text-muted-foreground text-xs md:text-sm text-center">
                    Please tell us a little about yourself and the project you have in mind to work on. Our team will collect applications from March 22 - May 23, 2025.
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
                                    <Question
                                        question={n.question}
                                        control={control}
                                        defaultValue={n.question.type === QuestionType.EMAIL ? user?.email : ''}
                                        rules={formRules}
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
                                                <Question
                                                    question={q}
                                                    control={control}
                                                    defaultValue={q.type === QuestionType.EMAIL ? user?.email : ''}
                                                    rules={formRules}
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
                <BackButton className="bottom-[-3rem] left-[1rem] absolute">
                    Not ready? Go back home
                </BackButton>
            </FormCard>
        </div>
    );
}