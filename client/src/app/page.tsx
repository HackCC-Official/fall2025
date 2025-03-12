//import Image from "next/image";
//import QRScanner from "../components/qrscan"
import FrontPage from "../features/home-page/home"
import AttendeeContainer from "@/features/attendee/AttendeeContainer";
import Venue from "../features/venue/map";
import Footer from "@/features/footer/apply-page/Footer";
import VolunteerJudgeContainer from "../features/volunteer-judge/VolunteerJudgeContainer";
export default function Home() {
  return (

    <div className="flex flex-wrap w-screen h-screen">
      <FrontPage></FrontPage>
      {/* <Nav></Nav> */}
    
      <AttendeeContainer/>
      <Venue></Venue>
      <VolunteerJudgeContainer></VolunteerJudgeContainer>
      <Footer></Footer>
    </div>

  )
}
