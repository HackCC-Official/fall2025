import PanelLayout from "../layout";
import { ApplicationType } from "@/features/application/types/application";
import { ApplicationPageComponent } from "../../../features/application/components/application-page-components";

export default function VolunteerApplicationPage() {
  return <ApplicationPageComponent applicationType={ApplicationType.VOLUNTEER} />;
}

VolunteerApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>;
