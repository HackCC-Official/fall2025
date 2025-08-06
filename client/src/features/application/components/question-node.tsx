import { FileUploader } from "@/components/ui/file-uploader";
import { QuestionResponseDto } from "@/features/question/types/question-response.dto";
import { Control, Controller, ControllerFieldState, ControllerRenderProps, RegisterOptions } from "react-hook-form";
import { ApplicationInput, ApplicationError, ApplicationTextarea, ApplicationCalendar } from "./application-input";
import { ApplicationMultipleGroup, ApplicationMultipleItem } from "./application-multiple";
import { ApplicationSelect } from "./application-select";
import { QuestionType } from "@/features/question/types/question-type.enum";

export interface QuestionGroupNode {
    type: 'GROUP';
    questions: QuestionResponseDto[];
    isSingleLabel: boolean;
    label: string;
}

export interface QuestionNode {
    type: 'NODE';
    question: QuestionResponseDto;
}

export interface FormValues {
    [key: string]: string | number | File | null; // Dynamic form values
}

export type QuestionNodes = QuestionNode | QuestionGroupNode;

export interface QuestionNodeComponentProps {
  question: QuestionResponseDto;
  field: ControllerRenderProps<FormValues, string>;
  fieldState: ControllerFieldState;
  maxWordLength?: number;
}

export function TextQuestion({ question, field, fieldState: { error } } : QuestionNodeComponentProps) {
  return (
    <div>
        <ApplicationInput {...field} placeholder={question.placeholder} type="text" />
        {error && <ApplicationError>{error.message}</ApplicationError>}
    </div>
  )
}

export function TextareaQuestion({ field, fieldState: { error }, maxWordLength = 500 } : QuestionNodeComponentProps ) {
  return (
    <div>
        <ApplicationTextarea
            maxWord={maxWordLength}
            {...field}
        />
        {error && <ApplicationError>{error.message}</ApplicationError>}
    </div>
  )
}

export function DateQuestion({ question, field, fieldState: { error } } : QuestionNodeComponentProps) {
  return (
      <div>
        <ApplicationCalendar {...field} value={field.value as unknown as Date} />
        {error && <ApplicationError>{error.message}</ApplicationError>}
    </div>
  )
}

export function FileQuestion({ question, field, fieldState: { error } } : QuestionNodeComponentProps) {
  return (
    <div>
        <FileUploader
            {...field}
            value={field.value as unknown as File[]} // Cast field.value to File[]
            onValueChange={field.onChange} // Pass field.onChange directly
            maxFileCount={1} // Allow only 1 file (or adjust as needed)
            maxSize={1000000 * 25}
        />
        {error && <ApplicationError>{error.message}</ApplicationError>}
    </div>
  )
}

interface SelectionQuestionProps extends QuestionNodeComponentProps {
  values: string[];
}

export function SelectionQuestion({ values, question, field, fieldState: { error } } : SelectionQuestionProps) {
  return (
    <div>
        <ApplicationSelect
            {...field}
            placeholder={question.placeholder || ''}
            value={String(field.value)}
            values={values}
        />
      {error && <ApplicationError>{error.message}</ApplicationError>}
    </div>
  )
}

export function EmailQuestion({ question, field, fieldState: { error } } : QuestionNodeComponentProps) {
  return (
    <div>
        <ApplicationInput {...field} placeholder={question.placeholder} type="email" />
        {error && <ApplicationError>{error.message}</ApplicationError>}
    </div>
  )
}

interface MultipleQuestionProps extends QuestionNodeComponentProps {
  keyPrefix: string;
}

export function MultipleQuestion({ keyPrefix, question, field, fieldState: { error } } : MultipleQuestionProps) {
  return (
      <div>
          <ApplicationMultipleGroup className="mt-4">
              {
                  question.possibleAnswers ?
                  question.possibleAnswers.map((p, i) => (
                      <ApplicationMultipleItem key={keyPrefix + String(i)} id={keyPrefix + String(i)} {...field} value={p} />
                  ))
                  :
                  []
              }
          </ApplicationMultipleGroup>
          {error && <ApplicationError>{error.message}</ApplicationError>}
      </div>
  )
}

import schools from '@/features/application/data/schools.json';
import residences from '@/features/application/data/residences.json';

export interface QuestionProps {
  question: QuestionResponseDto, 
  control?: Control<FormValues, any>;
  defaultValue?: string | number | File | null | undefined
  rules?: Omit<RegisterOptions<FormValues, `question_${number}`>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined
}

export function Question({ question, defaultValue, control, rules } : QuestionProps) {
  return <Controller
      name={`question_${question.id}`}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState }) => {
          switch (question.type) {
              case QuestionType.TEXT:
                  return <TextQuestion question={question} field={field} fieldState={fieldState} />
              case QuestionType.TEXTAREA:
                  return <TextareaQuestion question={question} field={field} fieldState={fieldState} />
              case QuestionType.DATE:
                  return <DateQuestion question={question} field={field} fieldState={fieldState} />
              case QuestionType.FILE:
                  return <FileQuestion question={question} field={field} fieldState={fieldState} />
              case QuestionType.SELECT:
                  if (question.name === 'school') {
                      return <SelectionQuestion 
                          values={schools.map(s => s.institution)} 
                          question={question} 
                          field={field} 
                          fieldState={fieldState} 
                      />
                  } else if (question.name === 'residence') {
                      return (
                          <SelectionQuestion 
                              values={residences.map(r => r.city)} 
                              question={question} 
                              field={field} 
                              fieldState={fieldState} 
                          />
                      );
                  }
                  return <div>Unsupported question type</div>;
              case QuestionType.EMAIL:
                  return (
                      <EmailQuestion question={question} field={field} fieldState={fieldState} />
                  );
              case QuestionType.MULTIPLE:
                  if (question.name === 'gender') {
                      return (
                          <MultipleQuestion
                              keyPrefix='gender_'
                              question={question} 
                              field={field} 
                              fieldState={fieldState}
                          />
                      );
                  } else if (question.name === 'gradYear') {
                      return (
                          <MultipleQuestion
                              keyPrefix='grad_year_'
                              question={question} 
                              field={field} 
                              fieldState={fieldState}
                          />
                      )
                  }
                  return <div>Unsupported question type</div>;
              default:
                  return <div>Unsupported question type</div>;
          }
      }}
  />
}