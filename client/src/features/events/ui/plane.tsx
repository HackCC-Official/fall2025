import Image from "next/image"
import spritesheet from "../../../../public/planesprite.png"
import ropeimg from "../../../../public/Rope.png"

export default function Plane() {
    return (
        <>
            <div className="z-10 relative flex-shrink-0 mr-10 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] overflow-hidden">
                <Image className="left-0 absolute w-[1500px] lg:w-[2000px] h-[300px] lg:h-[400px] object-cover object-left overflow-visible animate-moveSpriteSheetsm lg:animate-moveSpriteSheetlg" src={spritesheet} alt="plane" ></Image>
            </div>
            <Image src={ropeimg} alt="rope" className="invisible md:visible lg:bottom-[140px] md:left-[110px] lg:left-[210px] z-0 absolute w-[250px] h-auto"></Image>
        </>
    )
}