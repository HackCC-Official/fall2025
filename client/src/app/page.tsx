import Image from "next/image";
import FrontPage from "../features/home-page/home"

export default function HomePage() {
  return (
    <div className="flex w-screen h-screen">
      <FrontPage></FrontPage>
      {/* <Nav></Nav> */}
    </div>
  )
}