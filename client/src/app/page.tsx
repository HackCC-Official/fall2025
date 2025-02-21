import Image from "next/image";
import FrontPage from "../feature/home-page/home"
import Nav from "../components/navbar"

export default function HomePage() {
  return (
    <div className="flex bg-gradient-to-b from-royalpurple to-lightpurple h-screen">
      <FrontPage></FrontPage>
      {/* <Nav></Nav> */}
    </div>
  )
}