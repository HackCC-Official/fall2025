import CollageFull from '../../../public/CollageFull.png'
import CollageCenter from '../../../public/CollageCenter.png'

import Image from 'next/image'
//<Image src={Texture} alt="bg" className='w-full h-auto'></Image>
export default function Collage() {
    return <div className="-z-30 flex flex-row justify-center items-center bg-[#251884] w-full h-aut overflow-x-clip o">
        <Image className="hidden sm:block max-w-[1500px]" src={CollageFull} alt="Full Collage"/>
        <Image className="sm:hidden block mx-16 scale-75" src={CollageCenter} alt="Center Collage"/>
    </div>
}
