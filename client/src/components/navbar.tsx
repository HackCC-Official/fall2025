import Image from "next/image"
import logo from "../assets/hackcc.png"
import { ApplyButton } from "./applybutton"

export const Navbar = () => {
    return (
        <div className='z-50 font-mont text-white fixed flex justify-center items-center p-3  w-screen l-0 t-0 [&>*]:mx-6 bg-glass backdrop-blur-md'>
            <a href="">About</a>
            <a href="">Venue</a>
            <a href="">Get Involved</a>
            <ApplyButton text="Apply" size="sm"></ApplyButton>
        </div>
    )
}
