import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDiscord,
    faInstagram,
    faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

interface SocialsProps {
    baseColor: string;
    hoverColor: string;
}


export const Socials = ({ baseColor = "text-white", hoverColor = "hover:text-red-500" } :SocialsProps) => {
    return (
        <div className='flex sm:[&>*]:text-3xl text-2xl [&>*]:align-center sm:[&>*]:mx-4 [&>*]:mx-3 z-50 text-white'>
            <a className={`${baseColor} ${hoverColor}`} target='_blank' href="https://discord.gg/yRShGV7Py4"><FontAwesomeIcon icon={faDiscord} /></a>
            <a className={`${baseColor} ${hoverColor}`} target='_blank' href="https://www.instagram.com/realhackcc/"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
    );
};
