
export const Title = (props: any) => {
    const { text } = props;

    return (
        <h1 className="font-bagel sm:my-8 text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl text-white">
            {text}
        </h1>
    )
}
