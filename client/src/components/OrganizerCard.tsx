import Image from "next/image";
import { montserrat_Alternates } from './styles/fonts'
interface OrganizerCardProps {
    imgPath: string;
    name: string;
    role: string;
}

export default function OrganizerCard({imgPath="/headshotPlaceholder.png", name="first last", role="Role or Team"}) {
    return(
        <div className={`bg-blue-400 p-4 rounded-md w-[150px] overflow-hidden text-center ${montserrat_Alternates.className}`}>
            <Image 
            src={imgPath}
            className="mx-auto"
            width={100} 
            height={100} 
            alt="Person" 
            sizes="100px"
            />
            <h2>{name}</h2>
            <h3>{role}</h3>
        </div>
    );
}