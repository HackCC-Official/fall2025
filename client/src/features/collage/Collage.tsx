import CollageFull from '../../../public/CollageFull.webp'
import CollageCenter from '../../../public/CollageCenter.webp'

import Image from 'next/image'
//<Image src={Texture} alt="bg" className='w-full h-auto'></Image>
export default function Collage() {
    return <div className="-z-30 flex flex-row justify-center items-center bg-[#251884] w-full h-aut overflow-x-clip o">
        <Image className="hidden sm:block max-w-[1500px]" src={CollageFull} sizes="(min-width: 1600px) 1500px, calc(91.49vw + 54px)" alt="Full Collage"/>
        <Image className="sm:hidden block mx-16 scale-75" src={CollageCenter} alt="Center Collage" sizes="(min-width: 500px) calc(100vw - 128px), (min-width: 460px) calc(-540vw + 2944px), calc(100vw - 128px)"/>
    </div>
}
