import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import PanelLayout from "../layout"
import { ApplicationFile, ApplicationHeader, ApplicationResponse } from "@/features/application/components/application-detail"
import { useRouter } from "next/router"
import { acceptApplication, denyApplication, getApplicationById } from "@/features/application/api/application"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ApplicationStatus } from "@/features/application/types/status.enum"

export default function ApplicationDetailPage() {
  if (typeof Promise.withResolvers === 'undefined') {
    if (window)
        // @ts-expect-error This does not exist outside of polyfill which this is doing
        window.Promise.withResolvers = function () {
            let resolve, reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return { promise, resolve, reject };
        };
  }
  const router = useRouter()

  const queryClient = useQueryClient()

  const { isLoading, data } = useQuery({
    queryKey: ['application',router.query.id],
    queryFn: () => getApplicationById(String(router.query.id)),
    enabled: !!router.query.id
  })

  const acceptMutation = useMutation({
    mutationFn: (applicationId: string) => acceptApplication(applicationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['application',router.query.id] })
    }
  })

  const denyMutation = useMutation({
    mutationFn: (applicationId: string) => denyApplication(applicationId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['application',router.query.id] })
    }
  })

  console.log(data)
  
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
            data.submissions.sort((a, b) => a.questionId - b.questionId).map(s => 
              <ApplicationResponse key={s.questionId} response={s} />
            )
          }
          {data.transcriptUrl && <ApplicationFile prompt="Transcript" url={data.transcriptUrl} />}
          <ApplicationFile prompt="Resume" url={data.resumeUrl} />
          <div className={cn([
            "hidden justify-end gap-4",
            data.status === ApplicationStatus.SUBMITTED && 'flex'
          ])}>
            <Button 
              onClick={() => acceptMutation.mutate(String(router.query.id))} 
              className="bg-green-500 hover:bg-emerald-600"
            >
                Accept
            </Button>
            <Button 
              onClick={() => denyMutation.mutate(String(router.query.id))} 
              className="bg-red-500 hover:bg-red-600"
            >
              Deny
            </Button>
          </div>
        </div>
      </>
      }
    </>
  )
}

ApplicationDetailPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>