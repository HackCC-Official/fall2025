import PanelLayout from "../layout";
import { ApplicationType } from "@/features/application/types/application";
import { ApplicationPageComponent } from "../../../features/application/components/application-page-components";

export default function HackathonApplicationPage() {
  return <ApplicationPageComponent applicationType={ApplicationType.HACKATHON} />;
}

HackathonApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>;