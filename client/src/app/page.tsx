import Image from "next/image";
import FrontPage from "../components/home"
import Stars from "../components/stars"
import Nav from "../components/navbar"
import clouds from "../assets/temp_clouds.png"

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-royalpurple to-lightpurple flex h-screen">
      <Stars></Stars>
      <FrontPage></FrontPage>
      <Image className="absolute w-screen bottom-0" src={clouds} alt="Clouds"></Image>
      <Nav></Nav>
    </div>
  );
}
