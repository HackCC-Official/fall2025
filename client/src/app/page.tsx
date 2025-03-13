//import Image from "next/image";
//import QRScanner from "../components/qrscan"
import About from "../components/About";  // About section
import Collage from "../components/Collage";  // Event collage section
import FrontPage from "../features/home-page/home"
import AttendeeContainer from "@/features/attendee/AttendeeContainer";
import Venue from "../features/venue/map";
import Footer from "@/features/footer/apply-page/Footer";
import VolunteerJudgeContainer from "../features/volunteer-judge/VolunteerJudgeContainer";

export default function HomePage() {

  return (
    <div className="flex flex-wrap w-screen h-screen">
      <FrontPage></FrontPage>
      {/* <Nav></Nav> */}
      <About />  {/* About HackCC section */}
      <Collage />  {/* Event photo collage */}
      <AttendeeContainer/>
      <Venue></Venue>
      <VolunteerJudgeContainer></VolunteerJudgeContainer>
      <Footer></Footer>
    </div>
  )
}
