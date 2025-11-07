interface props {
    day?: string;
    text?: string;
    items?: string[];
}

export default function Card({day="day -1", text="text goes here", items}:props) {
    return(
        <div className="flex-shrink-0 bg-white hover:shadow-xl mx-2 md:mx-0 p-4 px-6 md:py-3 rounded-lg w-full max-w-md h-[250px]">
            <h2 className="font-bagel text-hoverpurple text-xl">{day}</h2>
            <h3 className="font-mont font-extrabold">what to expect</h3>
            {items ? (
                <ul className="space-y-1 mt-4 font-mont font-semibold text-graytext text-sm md:text-base text-left list-disc list-inside">
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="font-mont text-graytext text-xs md:text-base">{text}</p>
            )}
        </div>
    )
}