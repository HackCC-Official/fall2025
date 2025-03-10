import Image from "next/image"
import logo from "../assets/hackcc.png"

const navbar = () => {
    return (
        <div className='z-999 fixed flex justify-between items-center bg-white bg-opacity-5 px-4 w-screen l-0 t-0'>
            <div className="flex justify-between items-center">
                <Image className="w-auto h-24" src={logo} alt="HackCC Logo"/>
            </div>
            <div className="flex justify-between items-center">
                <button className="group inline-flex relative justify-center items-center bg-pink-200 px-6 rounded-md h-12 font-medium text-neutral-200 overflow-hidden">
                    <span className="text-black">Sponsor Us</span>
                    <div className="absolute inset-0 flex justify-center w-full h-full [transform:skew(-12deg)_translateX(-100%)] group-hover:[transform:skew(-12deg)_translateX(100%)] group-hover:duration-1000">
                        <div className="relative bg-white/20 w-8 h-full"></div>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default navbar