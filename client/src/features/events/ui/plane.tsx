import Image from "next/image"
 import spritesheet from "../../../../public/Plane Sprite Sheet.webp"
 import ropeimg from "../../../../public/Rope.webp"
 
 export default function Plane() {
     return (
         <div className="flex-shrink-0 w-[300px] lg:w-[400px] h-auto">
             <div className="z-10 relative flex-shrink-0 mr-10 w-[300px] lg:w-[400px] h-auto overflow-hidden">
                <Image src={spritesheet} className="min-w-[1500px] lg:min-w-[2000px] h-auto animate-moveSpriteSheet" alt="plane"></Image>
            </div>
             <Image src={ropeimg} alt="rope" className="invisible md:visible md:bottom-[90px] lg:bottom-[140px] md:left-[110px] lg:left-[210px] z-0 absolute w-[250px] h-auto"></Image>
         </div>
     )
 }
 