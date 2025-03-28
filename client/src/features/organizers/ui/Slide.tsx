
import Image from "next/image";
interface props {
    indvidualName1?: string;
    indvidualRole1?: string;
    indviduaImageVaraible1?: string;
    indvidualName2?: string;
    indvidualRole2?: string;
    indviduaImageVaraible2?: string;

}
export default function Slide({indvidualName1, indvidualRole1, indviduaImageVaraible1='/Headshot Placeholder.webp', indvidualName2, indvidualRole2, indviduaImageVaraible2='/Headshot Placeholder.webp'}:props) {
    
    return (
        <div className="w-56 h-auto">
            <div className="z-50 flex flex-col justify-center items-center bg-white hover:shadow-2xl mx-auto my-10 lg:my-7 rounded-xl w-56 lg:w-60 h-[280px] lg:h-[300px]">
                <Image
                src={indviduaImageVaraible1} 
                className="rounded-xl w-36 lg:w-40 h-auto" 
                alt="organizer"
                width={144}
                height={144}
                sizes="(min-width: 1040px) 160px, 144px">
                </Image>
                <h2 className="mt-4 w-full font-mont font-black text-lg text-center truncate">{indvidualName1}</h2>
                <h3 className="pt-1 font-mont text-grey text-base">{indvidualRole1}</h3>
            </div>
            <div className="z-50 flex flex-col justify-center items-center bg-white hover:shadow-2xl mx-auto my-10 lg:my-7 rounded-xl w-56 lg:w-60 h-[280px] lg:h-[300px]">
                <Image
                src={indviduaImageVaraible2} 
                className="rounded-xl w-36 lg:w-40 h-auto" 
                alt="organizer"
                width={144}
                height={144}
                sizes="(min-width: 1040px) 160px, 144px">
                </Image>
                <h2 className="mt-4 w-full font-mont font-black text-lg text-center truncate">{indvidualName2}</h2>
                <h3 className="pt-1 font-mont text-grey text-base">{indvidualRole2}</h3>
            </div>
        </div>
    )
}