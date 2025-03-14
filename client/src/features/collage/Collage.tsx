import CollageFull from '../../../public/CollageFull.png'
import CollageCenter from '../../../public/CollageCenter.png'
import Image from 'next/image'

export default function Collage() {
    return <div className=" w-full h-auto bg-[#251884] flex flex-row items-center justify-center ">
        <Image className="hidden sm:block max-w-[1500px]" src={CollageFull} alt="Full Collage"/>
        <Image className="block sm:hidden mx-16 scale-75" src={CollageCenter} alt="Center Collage"/>
    </div>
}

