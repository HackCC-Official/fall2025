import cloud1 from "../../../../public/Pink Moving Cloud 1.webp"
import cloud2 from "../../../../public/Pink Moving Cloud 2.webp"
import Image from "next/image"
export function Cloud1() {
    return ( 

            <div className="relative w-[900px] md:h-[300px] shrink-0">
                <Image src={cloud1} alt ="cloud" className="left-[300px] absolute w-[100px] h-auto"></Image>
                <Image src={cloud2} alt ="cloud" className="bottom-[70px] left-[500px] absolute w-[320px] h-auto"></Image>
  
                <Image src={cloud2} alt ="cloud" className="bottom-0 left-[100px] absolute w-[250px] h-auto"></Image>
                <Image src={cloud2} alt ="cloud" className="top-0 left-[0px] absolute w-[150px] h-auto"></Image>
            </div>

    )
}
export function Cloud2() {
    return ( 

            <div className="relative w-[900px] md:h-[300px] shrink-0">
                <Image src={cloud1} alt ="cloud" className="top-0 left-[360px] absolute w-[200px] h-auto"></Image>
                <Image src={cloud2} alt ="cloud" className="bottom-[70px] left-[500px] absolute w-[300px] h-auto"></Image>
  
                <Image src={cloud1} alt ="cloud" className="bottom-16 left-[100px] absolute w-[140px] h-auto"></Image>
                <Image src={cloud1} alt ="cloud" className="top-0 left-[0px] absolute w-[300px] h-auto"></Image>
            </div>

    )
}