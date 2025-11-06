import { Title } from "@/components/title";
import Card from "./ui/Card"
import Plane from "./ui/plane"

const morningItems = [
    "8:00 AM  - Doors Open",
    "9:00 AM  - Opening Ceremony",
    "10:00 AM - Hacking Starts & Team Formation",
    "11:00 AM - Workshop: Vibecoding/API Intro"
]

const afternoonItems = [
    "12:00 PM - Lunch",
    "1:00 PM  - Workshop: GitHub Intro",
    "2:00 PM  - Super Smash Bros Tournament",
    "4:00 PM  - Clash Royale Tournament",
    "5:00 PM  - Poker Tournament"
]

const eveningItems = [
    "6:30 PM - Dinner",
    "7:00 PM - Submissions Due (Soft Deadline)",
    "8:00 PM - Hacking Ends (Hard Deadline)",
]

const nightItems = [
    "8:15 PM  - Project Expo",
    "9:15 PM  - Closing Ceremony",
    "10:00 PM - Doors Close"
]

export default function carousel() {
    return (
        <div id="scheduleTab" className="bg-gradient-to-b from-bgpurple to-richpurple -mt-[2px] py-20 w-full h-auto overflow-x-clip text-center">
            <Title text="Event Schedule"></Title>
            <div className="md:relative w-full h-auto md:h-[300px] lg:h-[400px]">
                <div className="-right-[1190px] md:absolute">
                    <div className="flex md:flex-row flex-col items-center gap-[20px] w-full h-auto md:animate-marqueeEffect md:hover:pause" >
                        <Plane></Plane>
                        <Card day="Morning (8-11 AM)" items={morningItems}></Card>      
                        <Card day="Afternoon (12-6 PM)" items={afternoonItems}></Card>
                        <Card day="Evening (6:30-8 PM)" items={eveningItems}></Card> 
                        <Card day="Night (8-10 PM)" items={nightItems}></Card>          
                    </div>  
                </div>
            </div>
        </div>
    )
}