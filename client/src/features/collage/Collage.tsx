import CollageFull from '../../../public/CollageFull.png'
import CollageCenter from '../../../public/CollageCenter.png'
import Texture from '../../../public/BGTexture2.png'
import Image from 'next/image'
//<Image src={Texture} alt="bg" className='w-full h-auto'></Image>
export default function Collage() {
    return (
        <div className='relative'>
            <div className=''></div>
            <div className="-z-30 absolute flex flex-row justify-center items-center bg-[#251884] w-full h-auto overflow-x-clip">
                <Image className="hidden sm:block max-w-[1500px]" src={CollageFull} alt="Full Collage"/>
                <Image className="sm:hidden block mx-16 scale-75" src={CollageCenter} alt="Center Collage"/>
            </div>
        </div>

        )
    
}

// <Image src={Texture} alt="background" className='left-0 absolute bg-red-500 min-w-[700px] max-w-[700px] h-auto'></Image>