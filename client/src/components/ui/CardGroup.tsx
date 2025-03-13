import Card2 from "./Card2"
interface OrganizerCardProps {
    name1: string;
    role1: string;
    imgPath1: string;
    name2: string;
    role2: string;
    imgPath2: string;
    name3: string;
    role3: string;
    imgPath3: string;
    name4: string;
    role4: string;
    imgPath4: string;

}
export default function OrganizerCard({name1="N/A", imgPath1="/headshotPlaceholder.png", role1="N/A",
                                       name2="N/A", imgPath2="/headshotPlaceholder.png", role2="N/A",
                                       name3="N/A", imgPath3="/headshotPlaceholder.png", role3="N/A",
                                       name4="N/A", imgPath4="/headshotPlaceholder.png", role4="N/A",
}:OrganizerCardProps) {
    return (
        <div className="flex flex-wrap place-content-evenly card-wrapper">
            {/* <Card2 name={name1} imgPath={imgPath1} role={role1}></Card2>
            <Card2 name={name2} imgPath={imgPath2} role={role2}></Card2>
            <Card2 name={name3} imgPath={imgPath3} role={role3}></Card2>
            <Card2 name={name4} imgPath={imgPath4} role={role4}></Card2> */}
        </div>
    );
}