import { FileUploader } from "@/components/ui/file-uploader";
import { QuestionResponseDto } from "@/features/question/types/question-response.dto";
import { Control, Controller, ControllerFieldState, ControllerRenderProps, RegisterOptions } from "react-hook-form";
import { ApplicationInput, ApplicationError, ApplicationTextarea, ApplicationCalendar } from "./application-input";
import { ApplicationRadioGroup, ApplicationRadioItem } from "./application-radio";
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

interface RadioQuestionProps extends QuestionNodeComponentProps {
  keyPrefix: string;
}

export function RadioQuestion({ keyPrefix, question, field, fieldState: { error } } : RadioQuestionProps) {
  return (
      <div>
          <ApplicationRadioGroup className="mt-4">
              {
                  question.possibleAnswers ?
                  question.possibleAnswers.map((p, i) => (
                      <ApplicationRadioItem key={keyPrefix + String(i)} id={keyPrefix + String(i)} {...field} value={p} />
                  ))
                  :
                  []
              }
          </ApplicationRadioGroup>
          {error && <ApplicationError>{error.message}</ApplicationError>}
      </div>
  )
}

interface MultipleQuestionProps extends QuestionNodeComponentProps {
  keyPrefix: string;
}

export function MulitpleQuestion({ keyPrefix, question, field, fieldState: { error }} : MultipleQuestionProps) {
  // Helper function to safely split the comma-separated string
  const getCurrentValues = (value: string): string[] => {
    if (!value || value.trim() === '') return [];
    return value.split(',').filter(v => v.trim() !== '');
  };
  
  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = getCurrentValues(field.value as string);
    let newValues: string[];
    
    if (checked) {
      // Add to array if checked and not already present
      newValues = currentValues.includes(value) 
        ? currentValues 
        : [...currentValues, value];
    } else {
      // Remove from array if unchecked
      newValues = currentValues.filter(v => v !== value);
    }
    
    // Join and update field value
    field.onChange(newValues.join(','));
  };

  return (
    <div>
      <ApplicationMultiple className="mt-4">
        {
          question.possibleAnswers ?
          question.possibleAnswers.map((p, i ) => (
            <ApplicationCheckboxItem 
              id={keyPrefix + String(i)} 
              key={i} 
              value={p}
              defaultChecked={getCurrentValues(field.value as string).includes(p)}
              onChange={handleCheckboxChange}
            />
          ))
          :
          []
        }
      </ApplicationMultiple>
      {error && <div className="mt-2 text-red-500 text-sm">{error.message}</div>}
    </div>
  )
}


import schools from '@/features/application/data/schools.json';
import residences from '@/features/application/data/residences.json';
import { ApplicationCheckboxItem, ApplicationMultiple } from "./application-multiple";

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
              case QuestionType.RADIO:
                    return <RadioQuestion
                              keyPrefix={question.name || ''}
                              question={question} 
                              field={field} 
                              fieldState={fieldState}
                            />
              case QuestionType.MULTIPLE:
                  return <MulitpleQuestion 
                            keyPrefix={question.name || ''}
                            question={question} 
                            field={field} 
                            fieldState={fieldState}
                          />
              default:
                  return <div>Unsupported question type</div>;
          }
      }}
  />
}