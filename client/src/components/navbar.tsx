import Image from "next/image"
import logo from "../assets/hackcc.png"

const navbar = () => {
    return (
        <div className='fixed flex justify-between px-4 t-0 l-0 w-screen bg-white z-999 bg-opacity-5'>
            <div>
                <Image className="h-24 w-auto" src={logo} alt="HackCC Logo"/>
            </div>
            <div>
                <Image className="h-24 w-auto" src={logo} alt="HackCC Logo"/>
            </div>
        </div>
    )
}

export default navbar