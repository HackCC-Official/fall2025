import Image from "next/image";
import FrontPage from "../features/home-page/home"
import Stars from "../components/stars"
import clouds from "../assets/temp_clouds.png"

export default function HomePage() {
  return (
    <div className="flex bg-gradient-to-b from-royalpurple to-lightpurple h-screen overflow-x-hidden">
      <Stars></Stars>
      <FrontPage></FrontPage>
      <Image className="bottom-0 absolute w-screen" src={clouds} alt="Clouds"></Image>
      {/* <Nav></Nav> */}
    </div>
  )
}