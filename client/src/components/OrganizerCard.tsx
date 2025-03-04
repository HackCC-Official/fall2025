import Card from "./Card"
export default function OrganizerCard() {
    return (
        <div className="flex flex-wrap place-content-evenly card-wrapper">
            <Card></Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
        </div>
    );
}