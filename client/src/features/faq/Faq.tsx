import Image from "next/image"
import Card from "./ui/Card"
import { Title } from "@/components/title";

import { faFile } from "@fortawesome/free-regular-svg-icons"
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons"
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons" 
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import texture from "../../../public/About Texture.webp"
import cloud from "../../../public/Pink Cloud Cluster 6.webp"
const text1 = "Applications are now open for all California community college students! If you're looking to take advantage of an exciting opportunity, be sure to submit your application between March 22nd and April 18th. This is the official application period, Don’t wait until the last minute—start and complete your application as soon as possible to avoid missing out!"
const text2 = "A Hackathon is an event where developers, designers, and tons of other tech interested people can come together to build projects within a short timeframe (36 hours at HackCC), to discover new opportunities and win awesome prizes."
const text3 = "Participants can form teams of up to 4 members. There will be a team formation event at the beginning of HackCC to ensure you find a team that works for you. We encourage you to reach out and make new connections all through out the event!"
const text4 = "Attending HackCC is an incredible opportunity, and the best part is, it comes at absolutely no cost to you! It is completely free to both apply to and attend HackCC. This means you can focus on what really matters: gaining hands-on experience, collaborating with like-minded peers, and expanding your knowledge in a fun, innovative environment"



export default function Faq() {
    return (
        <div className="bg-hoverpurple pt-60 w-full h-auto overflow-x-clip text-center"> 
            <div className="relative bg-gradient-to-b from-hoverpurple to-bgpurple pb-20 w-full h-auto">
            
            <Image src={texture} className='-top-96 sm:-top-80 left-0 z-0 absolute min-w-[800px] sm:min-w-[1500px] max-w-[800px] sm:max-w-[2000px] h-auto' alt="bg" sizes="(min-width: 640px) 1500px, 800px"></Image>
            <Image src={cloud} alt="cloud" className="right-0 -bottom-8 sm:-bottom-16 2xl:-bottom-24 z-10 absolute w-[300px] sm:w-[450px] 2xl:w-[600px] min-w-[300px] h-auto"></Image>
                <Title text="Educational Workshops"></Title>
                <div className="flex md:flex-row flex-col md:flex-wrap md:justify-center items-center gap-5 md:gap-8 mx-auto my-6 w-full max-w-[1350px] h-auto">
                    <Card hasSpeaker={false} title="When can I apply?" subtext={text1} iconDef={faFile}></Card>
                    <Card hasSpeaker={false} title="What is a hackathon?" subtext={text2} iconDef={faLaptopCode}></Card>
                    <Card hasSpeaker={false} title="Can I compete in a team?" subtext={text3} iconDef={faPeopleGroup}></Card>
                    <Card hasSpeaker={false} title="How much does it cost to attend?" subtext={text4} iconDef={faWallet}></Card>
                </div>
            </div>
        </div>
    )
}   