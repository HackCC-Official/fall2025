import Image from "next/image"
import logo from "../assets/hackcc.png"

const navbar = () => {
    return (
        <div className='fixed flex items-center justify-between px-4 t-0 l-0 w-screen bg-white z-999 bg-opacity-5'>
            <div className="flex items-center justify-between">
                <Image className="h-24 w-auto" src={logo} alt="HackCC Logo"/>
            </div>
            <div className="flex items-center justify-between">
                <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-pink-200 px-6 font-medium text-neutral-200">
                    <span className="text-black">Sponsor Us</span>
                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                        <div className="relative h-full w-8 bg-white/20"></div>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default navbar