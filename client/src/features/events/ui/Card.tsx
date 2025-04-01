
interface props {
    day?: string;
    text?: string;
}

export default function Card({day="day -1", text="text goes here"}:props) {
    return(
        <div className="flex-shrink-0 bg-white hover:shadow-xl px-2 py-5 md:py-3 rounded-lg w-[90%] max-w-sm h-[250px]">
            <h2 className="font-bagel text-hoverpurple text-xl">{day}</h2>
            <h3 className="font-mont font-extrabold">what to expect</h3>
            <p className="font-mont text-graytext text-xs md:text-base">{text}</p>
        </div>
    )
}