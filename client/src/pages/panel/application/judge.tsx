import { ApplicationPageComponent } from "@/features/application/components/application-page-components";
import PanelLayout from "../layout";
import { ApplicationType } from "@/features/application/types/application";

export default function JudgeApplicationPage() {
  return <ApplicationPageComponent applicationType={ApplicationType.JUDGE} />;
}

JudgeApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>;