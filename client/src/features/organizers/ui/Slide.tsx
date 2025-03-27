import { StaticImageData } from "next/image";
import Card from "./Card"

interface props {
    indvidualName1: string;
    indvidualRole1: string;
    indviduaImageVaraible1: StaticImageData;
    indvidualName2: string;
    indvidualRole2: string;
    indviduaImageVaraible2: StaticImageData;

}
export default function Slide({indvidualName1, indvidualRole1, indviduaImageVaraible1, indvidualName2, indvidualRole2, indviduaImageVaraible2}:props) {
    
    return (
        <div className="w-56 h-auto">
            <Card name={indvidualName1} role={indvidualRole1} path={indviduaImageVaraible1}></Card>
            <Card name={indvidualName2} role={indvidualRole2} path={indviduaImageVaraible2}></Card>
        </div>
    )
}