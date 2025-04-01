import Image from "next/image";
import placeholderImg from "../../../../public/Speaker Placeholder.webp"
import placeholderCompany from "../../../../public/Company Placeholder.png"
const defaultText = "Workshop description that is brief, but gives an idea of what to look foward to lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu nunc nec mauris accumsan sollicitudin."
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFaceAngry } from "@fortawesome/free-regular-svg-icons";
import { StaticImageData } from "next/image";
const placeHolderLogo = faFaceAngry;
interface props {
    title: string;
    subtext:string;

    speaker1?:string;
    speaker2?:string;
    speaker3?:string;
    speaker4?:string;
    img1?: StaticImageData;
    img2?: StaticImageData;
    img3?: StaticImageData;
    img4?: StaticImageData;
    company1?:StaticImageData;
    company2?:StaticImageData;
    company3?:StaticImageData;
    company4?:StaticImageData;
    hasSpeaker: boolean;

    iconDef?:IconDefinition;
}
export default function Card({speaker1,speaker2,speaker3,speaker4,
    img1=placeholderImg,img2=placeholderImg,img3=placeholderImg,img4=placeholderImg,
    company1=placeholderCompany,company2=placeholderCompany,company3=placeholderCompany,company4=placeholderCompany,
    title="title goes here",subtext=defaultText, iconDef=placeHolderLogo,
    hasSpeaker = false}:props) {

    if (hasSpeaker) {
        return (
            <div className="bg-glass backdrop-blur-md p-6 md:p-7 rounded-3xl w-[90%] max-w-[400px] md:max-w-[640px] h-auto md:h-96 overflow-hidden font-mont text-white">
                <h2 className="mx-auto mb-4 max-w-52 md:max-w-full font-bold text-base sm:text-lg md:text-2xl 2xl:text-3xl md:text-start">{title}</h2>
                <p className="mb-8 text-xs md:text-base 2xl:text-lg text-start">{subtext}</p>
                <div className="flex flex-wrap items-start">
                    <p className="md:mt-2 mb-3 w-28 text-start">HOSTED BY</p>
                    <div className="flex flex-wrap gap-4 w-full sm:w-72 h-auto">
                        {speaker1 && (
                            <div className="flex items-center w-full sm:w-auto h-auto">
                                <Image src={img1} alt="speaker" className="rounded-[100%] w-10 min-w-10 h-10"></Image>
                                <div className="flex flex-col items-start ml-2 w-20" >
                                    <p>{speaker1}</p>
                                    <Image src={company1} alt="company logo" className="w-7 h-auto"></Image>
                                </div>
                            </div>
                        )}
                        {speaker2 && (
                            <div className="flex items-center w-full sm:w-auto h-auto">
                                <Image src={img2} alt="speaker" className="rounded-[100%] w-10 min-w-10 h-10"></Image>
                                <div className="flex flex-col items-start ml-2 w-20">
                                    <p>{speaker2}</p>
                                    <Image src={company2} alt="company logo" className="w-7 h-auto"></Image>
                                </div>
                            </div>
                        )}
                        {speaker3 && (
                            <div className="flex items-center w-full sm:w-auto h-auto">
                                <Image src={img2} alt="speaker" className="rounded-[100%] w-10 min-w-10 h-10"></Image>
                                <div className="flex flex-col items-start ml-2 w-20">
                                    <p>{speaker3}</p>
                                    <Image src={company3} alt="company logo" className="w-7 h-auto"></Image>
                                </div>
                            </div>
                        )}
                        {speaker4 && (
                            <div className="flex items-center w-full sm:w-auto h-auto">
                                <Image src={img2} alt="speaker" className="rounded-[100%] w-10 min-w-10 h-10"></Image>
                                <div className="flex flex-col items-start ml-2 w-20">
                                    <p>{speaker4}</p>
                                    <Image src={company4} alt="company logo" className="w-7 h-auto"></Image>
                                </div>
                            </div>
                        )}                                                                        
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-glass2 backdrop-blur-md p-6 md:p-7 rounded-3xl w-[90%] md:w-[40%] md:min-w-[365px] max-w-[400px] md:max-w-[640px] h-auto md:h-[475px] font-mont text-white">
                <h2 className="mx-auto mb-4 max-w-52 md:max-w-full font-bold text-base sm:text-lg md:text-2xl 2xl:text-3xl md:text-start">{title}</h2>
                <p className="mb-8 text-xs md:text-base 2xl:text-lg text-start">{subtext}</p>
                <div className="flex justify-center text-7xl">
                    <FontAwesomeIcon icon={iconDef}></FontAwesomeIcon>
                </div>
            </div>
        )
    }
}