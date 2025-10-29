import Image from "next/image"
import { Logo } from "../logo"
import { ReactElement } from "react";
export default function Nav() {
    return(
        <div className="z-[100]">
            <div className={`text-base 2xl:text-xl flex justify-end z-50 font-mont text-white fixed p-3  w-screen l-0 t-0 [&>*]:mx-6 lg:bg-glass lg:backdrop-blur-md [&>*]:cursor-pointer`}>
                <h2><a href="/">Back to Main Page</a></h2>
            </div>
        </div>
    )
}