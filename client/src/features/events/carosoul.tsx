

import { Title } from "@/components/title";
import Card from "./ui/Card"
import Plane from "./ui/plane"

const day1Text = "HackCC starts off with an exciting opening ceremony commencing the beginning of many fun workshops and activities throughout the day!  Along with fun activities, Lunch and dinner will be served as well as some snacks to keep the energy high throughout the day!"
const day2Text = "Keeping the energy high through the night for those that continue. You can expect the next day to be full of activities again along with breakfast and lunch before the judging period begins and HackCC 2025 closing ceremony!"
export default function carousel() {
    return (
        <div className="bg-gradient-to-b from-bgpurple to-richpurple w-full h-auto overflow-x-clip text-center">
        <Title text="Event Schedule"></Title>
        <div className="md:relative w-full h-auto md:h-[300px] lg:h-[400px]">

            
            <div className="-right-[1190px] md:absolute">
                <div className="flex md:flex-row flex-col items-center gap-[20px] w-full h-auto md:animate-marqueeEffect md:hover:pause" >
                    <Plane></Plane>
                    <Card day="Day 1" text={day1Text}></Card>
                    <Card day="Day 2" text={day2Text}></Card>           
                </div>  
            </div>
        </div>
        </div>
    )
}
//-right-[1190px]
//md:animate-marqueeEffect md:hover:pause





//md:animate-marqueeEffect
//animate-moveSpriteSheet
//-right-[1068px]
/*
        <div className="bg-blue-500 w-full h-full">
            <div className="relative w-[250px] h-[250px] overflow-clip">
                <Image className="left-0 absolute w-[1250px] h-[250px] object-cover object-left overflow-visible animate-moveSpriteSheet" src={spritesheet} alt="plane" ></Image>
            </div>
        </div>
*/