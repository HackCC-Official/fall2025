//import Image from "next/image";
//import QRScanner from "../components/qrscan"



import SectionHeader from "@/components/SectionHeader";
import AttendeeContainer from "@/components/AttendeeContainer";
import OrganizerSlider from "@/components/OrganizerSlider";
export default function Home() {
  return (
    <div className="bg-[#E5E8EC]">
      <SectionHeader title="What past attendees have said"/>
      <AttendeeContainer/>
      <SectionHeader title="2025 Organizers"/>
      <OrganizerSlider/>
    </div>
  );
}
