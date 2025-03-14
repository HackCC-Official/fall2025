import CollageFull from '../../../public/CollageFull.png'
import CollageCenter from '../../../public/CollageCenter.png'
import Image from 'next/image'

export default function Collage() {
    return <div className="flex flex-row justify-center items-center bg-[#251884] w-full h-auto overflow-x-hidden">
        <Image className="hidden sm:block max-w-[1500px]" src={CollageFull} alt="Full Collage"/>
        <Image className="sm:hidden block mx-16 scale-75" src={CollageCenter} alt="Center Collage"/>
    </div>
}

