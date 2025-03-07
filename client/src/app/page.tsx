//import Image from "next/image";
//import QRScanner from "../components/qrscan"



import SectionHeader from "@/components/ui/SectionHeader";
import AttendeeContainer from "@/components/AttendeeContainer";
import OrganizerSlider from "@/components/OrganizerSlider";
import VenueContainer from "@/components/VenueContainer";
import Footer from "@/components/Footer";
import SectionSubHeading from "@/components/ui/SectionSubHeading";
export default function Home() {
  return (
    <div className="bg-[#E5E8EC]">
      <SectionHeader title="What past attendees have said"/>
      <AttendeeContainer/>
      <SectionHeader title="2025 Organizers"/>
      <OrganizerSlider/>
      <VenueContainer></VenueContainer>
      <SectionHeader title="Get Involved"></SectionHeader>
      <SectionSubHeading subtext="Interested in judging or being a volunteer?"></SectionSubHeading>
      <Footer></Footer>
    </div>
  );
}
