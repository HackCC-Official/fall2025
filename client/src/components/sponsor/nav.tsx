import Logo from "../../../public/Logo.webp"
import Image from "next/image"
export default function Nav() {
    return(
        <div className={`text-nowrap text-base 2xl:text-xl sm:flex  z-50 font-mont text-white fixed flex justify-between items-center p-3  w-screen l-0 t-0 [&>*]:mx-6 bg-hoverpurple [&>*]:cursor-pointer`}>
            <a href="/"><Image src={Logo} className="w-16 min-w-16 h-full" alt="logo"></Image></a>
            <h2 className="hover:text-black"><a href="/">Back to Main Page</a></h2>
        </div>
    )
}