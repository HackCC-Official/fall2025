//import Image from "next/image";
//import QRScanner from "../components/qrscan"

import Image from "next/image";
import FrontPage from "../features/home-page/home"
import Stars from "../components/stars"

import SectionHeader from "@/components/ui/SectionHeader";
import AttendeeContainer from "@/components/AttendeeContainer";
import OrganizerSlider from "@/components/OrganizerSlider";
import VenueContainer from "@/components/VenueContainer";
import Footer from "@/features/footer/apply-page/Footer";
import SectionSubHeading from "@/components/ui/SectionSubHeading";
import VolunteerJudgeContainer from "@/components/VolunteerJudgeContainer";
export default function Home() {
  return (

    <div className="flex flex-wrap w-screen h-screen">
      <FrontPage></FrontPage>
      {/* <Nav></Nav> */}
    
      <SectionHeader title="What past attendees have said"/>
      <AttendeeContainer/>
      <SectionHeader title="2025 Organizers"/>
      <OrganizerSlider/>
      <VenueContainer></VenueContainer>
      <SectionHeader title="Get Involved"></SectionHeader>
      <SectionSubHeading subtext="Interested in judging or being a volunteer?"></SectionSubHeading>
      <VolunteerJudgeContainer></VolunteerJudgeContainer>
      <Footer></Footer>
    </div>

  )
}
