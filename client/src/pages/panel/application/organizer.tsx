import { ApplicationPageComponent } from "@/features/application/components/application-page-components";
import PanelLayout from "../layout";
import { ApplicationType } from "@/features/application/types/application";

export default function OrganizerApplicationPage() {
  return <ApplicationPageComponent applicationType={ApplicationType.ORGANIZER} />;
}

OrganizerApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>;