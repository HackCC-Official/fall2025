//import Image from "next/image";
//import QRScanner from "../components/qrscan"

import Home from "../features/home-page/home"
import AttendeeContainer from "@/features/attendee/AttendeeContainer";
import Footer from "@/features/footer/apply-page/Footer";
import VolunteerJudgeContainer from "../features/volunteer-judge/VolunteerJudgeContainer";
import { Navbar } from "@/components/navbar";
import About from "@/features/about/about";
import Collage from "@/features/collage/Collage";
import Slider from "@/features/organizers/Slider";
import Carousel from "@/features/events/carosoul";
import Faq from "@/features/faq/Faq";
import VenueMap from "@/features/home-page/components/venue-map";

// TODO-IF-ACTION: Rearrange VolunterJudgeContainer to above Footer
export default function HomePage() {
  return (
    <div className="flex flex-wrap w-screen h-screen">
      <Navbar></Navbar>
      <Home></Home>
            <VenueMap />
      <VolunteerJudgeContainer></VolunteerJudgeContainer>
      <About></About>
      <Collage></Collage>
      <Faq></Faq>
      <Carousel></Carousel>
      <AttendeeContainer/>
      {/* <Slider></Slider> */}
      <Footer></Footer>
    </div>
  )
}