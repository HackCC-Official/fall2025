import Image from "next/image";
import { montserrat_Alternates } from './styles/fonts'

interface AttendeeCardProps {
  imgPath: string;
  name: string;
  subText:string;
}

export default function AttendeeCard({ imgPath = "/headshotPlaceholder.png", name = "first last", subText="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem voluptatibus voluptate porro sapiente est laborum magni? Quidem inventore delectus labore sed odit ad, iusto, earum expedita ratione libero debitis nostrum."}: AttendeeCardProps) {
  return (
    <div className="flex md:flex-1 my-5">
        <div className="justify-items-center mr-4 md:mr-8 text-center basis-2/5">
            <Image 
            src={imgPath}
            className="md:w-[300px] md:h-auto"
            width={100} 
            height={100} 
            alt="Person" 
            sizes="100px"/>
            <h2 className={`${montserrat_Alternates.className} font-semibold py-3 md:text-[1.2rem] lg:text-[1.3rem] xl:text-[1.5rem]`}>{name}</h2>
        </div>
        <div className="overflow-hidden text-[0.75rem] basis-3/5">
            <Image
            src="/Quote.png"
            className="md:w-[40px] h-auto"
            width={30}
            height={30}
            alt="quotes"
            sizes="30px"
            />
            <p className={`${montserrat_Alternates.className} font-medium md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1.1rem]`}>{subText}</p>
        </div>
    </div>
  );
}
