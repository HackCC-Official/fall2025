 
"use client";
import { Logo } from "@/components/logo";
import { ApplicationLabel } from "@/features/application/components/application-input";
import { FormCard } from "@/features/application/components/form-card";
import { QuestionType } from "@/features/question/types/question-type.enum";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/features/application/types/status.enum";
import { DarkCard } from "@/components/dark-card";
import { Spinner } from "@/components/ui/spinner";
import { BackButton } from "@/features/application/components/back-btn";
import { Question } from "@/features/application/components/question-node";
import { FrontPageSecondaryLayout } from "@/layouts/front-page-layout";
import { useAuthentication } from "@/features/auth/hooks/use-authentication";
import { useApplication } from "@/features/application/hook/use-application";
import { createJudgeApplication, getJudgeApplicationByUserId } from "@/features/application/api/judge-application";
import { getJudgeQuestions } from "@/features/question/api/judge-question";

export default function JudgeApplicationPage() {
    const { user, authCheck } = useAuthentication();
    const { 
        formRules,
        applicationQuery, 
        questionQuery, 
        applicationMutation, 
        nodes, 
        handleSubmit, 
        onSubmit,
        control 
    } = useApplication({
        key: 'judge',
        user,
        getApplicationByUserId: getJudgeApplicationByUserId,
        getQuestions: getJudgeQuestions,
        createApplication: createJudgeApplication
    })

    if (!authCheck || applicationQuery.isLoading || questionQuery.isLoading) {
        return (
            <FrontPageSecondaryLayout />
        );
    }

    if (applicationQuery && applicationQuery.data && applicationQuery.data.status === ApplicationStatus.SUBMITTED) {
        return (
            <FrontPageSecondaryLayout>
                <div className="flex flex-col justify-center items-center mx-auto mt-24 md:mt-16 2xl:mt-20 xl:mt-16 text-white">
                    <div className="relative flex">
                        <Logo />
                    </div>
                    <div className="z-10 flex sm:flex-row flex-col mt-4 mb-8 lg:mb-12 xl:mb-16 font-bagel text-2xl sm:text-3xl md:text-4xl text-center md:md-8">
                        <p>2025 Judge Application</p>
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
            </FrontPageSecondaryLayout>
        )
    }

    return (
        <FrontPageSecondaryLayout>
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
                    <p>2025 Judge Application</p>
                </div>
            </div>
            <FormCard className="relative p-4 md:p-16 font-mont">
                <BackButton className="top-[-3rem] left-[1rem] absolute">
                    Go back home
                </BackButton>
                <h1 className="font-bagel md:text-[2rem] text-xl text-center">Thank you for Applying!</h1>
                <p className="mt-2 md:mt-4 px-4 md:px-20 font-semibold text-muted-foreground text-xs md:text-sm text-center">
                    Apply to be a judge and help us evaluate projects during the hackathon. We're looking for individuals with experience in tech, design, or entrepreneurship. Let us know about your background and what makes you a great fit to judge.
                     Our team will collect applications from from Mmm dd - Mmm dd, 2025.
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
        </FrontPageSecondaryLayout>
    );
}