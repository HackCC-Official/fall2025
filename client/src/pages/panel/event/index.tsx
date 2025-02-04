import PanelLayout from "../layout"

export default function EventPage() {
  return (
    <div>
      <h1 className="font-semibold text-4xl">Event</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Manage the hackathon event by creating event dates which represent the actual day the hackathon is taking place
      </p>
    </div>
  )
}

EventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>