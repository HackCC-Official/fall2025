'use-client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CircleUser } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmailBadge, ContactBadge, SchoolBadge } from "./application-status";
import { Separator } from "@/components/ui/separator";
import { Document, Page, pdfjs } from 'react-pdf'
import { useMemo, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ApplicationResponseDTO } from "../types/application";
import { SubmissionRequestDTO } from "@/features/submission/types/submission-request.dto";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getSubmissionById } from "@/features/submission/api/submission";
import { ApplicationStatus } from "../types/status.enum";
import { QuestionType } from "@/features/question/types/question-type.enum";

export function ApplicationHeader({ application } : { application: ApplicationResponseDTO }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <div className="flex bg-purple-50 p-2 border border-lightpurple rounded-md text-lightpurple">
              <CircleUser />
          </div>
          <div className="ml-4 text-2xl">{application.firstName + ' ' + application.lastName}</div>
          <Separator className="mx-4 h-6" orientation="vertical"/>
          <ApplicationStatusBadge status={application.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-x-2">
        <EmailBadge>{application.email}</EmailBadge>
        <ContactBadge>{application.phoneNumber}</ContactBadge>
        <SchoolBadge>{application.school}</SchoolBadge>
      </CardContent>
    </Card>
  )
}

export function ApplicationStatusBadge({ status } : { status: ApplicationStatus }) {
  if (status === ApplicationStatus.SUBMITTED) {
    return (
      <Badge>{status}</Badge>
    )
  } else if (status === ApplicationStatus.DENIED) {
    return (
      <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>
    )
  }

  return <Badge className="bg-emerald-500 hover:bg-emerald-600">{status}</Badge>
}

export function ApplicationResponseSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="w-full h-4" />
      <Skeleton className="mt-4 w-full h-4" />
      <Skeleton className="mt-2 w-full h-4" />
      <Skeleton className="mt-2 w-full h-4" />
      <Skeleton className="mt-2 w-full h-4" />
    </ Card>
  )
}

export function ApplicationResponse({ response } : { response: SubmissionRequestDTO }) {
  const { isLoading, data } = useQuery({
    queryKey: ['question', response.id],
    queryFn: () => getSubmissionById(String(response.id))
  })

  if (isLoading) {
    return <ApplicationResponseSkeleton />
  }

  if (data?.question.type === QuestionType.MULTIPLE)
  {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>{data && data.question.prompt}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-x-2'>
            {response.answer.split(',').map((a, i) => (
              <Badge key={i}>{a}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{data && data.question.prompt}</CardTitle>
      </CardHeader>
      <CardContent>{response.answer}</CardContent>
    </Card>
  )
}

export function ApplicationFile({ prompt, url }: { prompt: string, url: string }) {
  const [numPages, setNumPages] = useState(0);
  const [isDocumentReady, setIsDocumentReady] = useState(false);

  const options = useMemo(() => {
    return {
      cMapUrl: '/bcmaps/',
      cMapPacked: true,
    };
  }, []);



  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsDocumentReady(true)
  };

  
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{prompt}</CardTitle>
      </CardHeader>
      <CardContent>
        <Document 
          key={'resume'}
          file={{ url }}
          onLoadSuccess={onLoadSuccess}
          options={options}
          >
            {isDocumentReady && Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
        </Document>
      </CardContent>
    </Card>
  )
}