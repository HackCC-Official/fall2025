import { useQuery } from "@tanstack/react-query"
import PanelLayout from "../layout"
import { ApplicationFile, ApplicationHeader, ApplicationResponse } from "@/features/application/components/application-detail"
import { useRouter } from "next/router"
import { getApplicationById } from "@/features/application/api/application"

export default function ApplicationDetailPage() {
  const router = useRouter()
  const { isLoading, data } = useQuery({
    queryKey: ['application',router.query.id],
    queryFn: () => getApplicationById(String(router.query.id)),
    enabled: !!router.query.id
  })
  return (
    <>
      {
        isLoading && ''
      }
      {
        !isLoading && data &&
        <>
        <ApplicationHeader application={data} />
        <h2 className="mt-8 font-semibold text-xl">Submissions</h2>
        <div className="space-y-4 my-4">
          {
            data.submissions.map(s => 
              <ApplicationResponse key={s.questionId} response={s} />
            )
          }
          <ApplicationFile prompt="Transcript" url={data.transcriptUrl} />
          <ApplicationFile prompt="Resume" url={data.resumeUrl} />
        </div>
      </>
      }
    </>
  )
}

ApplicationDetailPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>