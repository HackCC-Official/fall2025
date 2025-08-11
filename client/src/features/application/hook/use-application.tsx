import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FormValues, QuestionGroupNode, QuestionNodes } from "../components/question-node";
import { ApplicationRequestDTO } from "../types/application";
import { ApplicationStatus } from "../types/status.enum";
import { QuestionResponseDto } from "@/features/question/types/question-response.dto";
import { User } from "@supabase/supabase-js";
import { debounce } from "lodash";
import { Document } from "../api/application";

interface useApplicationProps {
  user: User | null;
  key: string;
  getApplicationByUserId: (userId: string) => Promise<{ status: ApplicationStatus }>,
  getQuestions: () => Promise<QuestionResponseDto[]>,
  createApplication: (applicationDTO: ApplicationRequestDTO, document: Document) => Promise<ApplicationRequestDTO>;
}

export function useApplication({
  user,
  key,
  getApplicationByUserId,
  getQuestions,
  createApplication
}: useApplicationProps) {
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

    const [applicationQuery, questionQuery] = useQueries({
        queries: [
            {
                queryKey: [`${key}-application-user`, user ? user.id : ''],
                queryFn: () => getApplicationByUserId(user ? user.id : ''),
                enabled: () => !!(user && user.id)
            },
            {
                queryKey: [`${key}-questions`],
                queryFn: () => getQuestions()
            }
        ]
    })

    const applicationMutation = useMutation({
        mutationFn: (
            { applicationDTO,  document } : { 
              applicationDTO: ApplicationRequestDTO, 
              document: Document 
            }
            ) => 
            createApplication(applicationDTO, document)
        ,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [`${key}-application-user`, user ? user.id : ''] })
        }
    })

    const { control, handleSubmit } = useForm<FormValues>({
        mode: 'onChange', // This enables validation on change
        reValidateMode: 'onChange', // This ensures re-validation happens on change
    });

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

    return {
      formRules,
      applicationQuery,
      questionQuery,
      applicationMutation,
      debouncedLargerThanMaxWordLength,
      nodes,
      onSubmit,
      handleSubmit,
      control
    }
}