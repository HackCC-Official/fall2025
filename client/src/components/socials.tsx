import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faInstagram, faTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons'

export const Socials = () => {
    return (
        <div className='flex [&>*]:w-8 [&>*]:flex [&>*]:align-center [&>*]:mx-1 fixed bottom-4 right-4'>
            <a target='_blank' href="https://www.instagram.com/hackcc.2024/"><FontAwesomeIcon icon={faInstagram} /></a>
            <a target='_blank' href="https://www.tiktok.com/@hackcc24"><FontAwesomeIcon icon={faTiktok} /></a>
            <a target='_blank' href="https://x.com/hackcc_2024"><FontAwesomeIcon icon={faTwitter} /></a>
            <a target='_blank' href="https://discord.gg/yRShGV7Py4"><FontAwesomeIcon icon={faDiscord} /></a>
        </div>
    )
}