import Image, { StaticImageData} from "next/image";

import placeholder from '../../../../public/Headshot Placeholder.webp'
import { useState } from "react";

interface props {
    individualName1?: string;
    individualRole1?: string;
    individualImageVariable1?: StaticImageData;
    individualLink1?: string;
    individualName2?: string;
    individualRole2?: string;
    individualImageVariable2?: StaticImageData;
    individualLink2?: string;
}
export default function Slide({individualName1, individualRole1, individualImageVariable1=placeholder, individualLink1, individualName2, individualRole2, individualImageVariable2=placeholder, individualLink2}:props) {
    let [role2, setRole2] = useState(individualRole2);

    return (
        <div className="w-56 h-auto">
            <a target="_blank" href={individualLink1} className="cursor-pointer">
                <div className="z-50 flex flex-col justify-center items-center bg-white hover:shadow-2xl mx-auto my-10 lg:my-7 rounded-xl w-52 lg:w-60 h-[260px] lg:h-[300px]">
                    <Image
                    src={individualImageVariable1} 
                    className="rounded-xl w-[135px] lg:w-40 h-auto" 
                    alt="organizer"
                    width={144}
                    height={144}
                    sizes="(min-width: 1040px) 160px, 144px">
                    </Image>
                    <h2 className="mt-4 w-full font-mont font-black hover:text-royalpurple text-lg text-center truncate">{individualName1}</h2>
                    <h3 className="pt-1 font-mont text-grey text-base">{individualRole1}</h3>
                </div>
            </a>
            <a target="_blank" href={individualLink2} className="cursor-pointer">
                <div className="z-50 flex flex-col justify-center items-center bg-white hover:shadow-2xl mx-auto my-10 lg:my-7 rounded-xl w-52 lg:w-60 h-[260px] lg:h-[300px]">
                    <Image
                    src={individualImageVariable2} 
                    className="rounded-xl w-[135px] lg:w-40 h-auto" 
                    alt="organizer"
                    width={144}
                    height={144}
                    sizes="(min-width: 1040px) 160px, 144px">
                    </Image>
                    <h2 className="mt-4 w-full font-mont font-black hover:text-royalpurple text-lg text-center truncate">{individualName2}</h2>
                    <h3 onMouseEnter={() => setRole2(individualName2 == "Evan Ly" ? "Backend Specialist" : individualRole2) } onMouseLeave={() => setRole2(individualName2 == "Evan Ly" ? "Website" : individualRole2) } className="pt-1 font-mont text-grey text-base">{role2}</h3>
                </div>
            </a>
        </div>
    )
}