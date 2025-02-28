import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDiscord,
    faInstagram,
    faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export const Socials = () => {
    return (
        <div className='flex [&>*]:h-8 [&>*]:flex [&>*]:align-center [&>*]:mx-3 z-50 text-white'>
            {/* <a target='_blank' href="https://www.tiktok.com/@hackcc24"><FontAwesomeIcon icon={faTiktok} /></a> */}
            <a className='hover:text-navyblue' target='_blank' href="https://discord.gg/yRShGV7Py4"><FontAwesomeIcon icon={faDiscord} /></a>
            <a className='hover:text-navyblue' target='_blank' href="https://x.com/hackcc_2024"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a className='hover:text-navyblue' target='_blank' href="https://www.instagram.com/realhackcc/"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
    );
};
