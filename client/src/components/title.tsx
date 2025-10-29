
export const Title = (props: any) => {
    const { text } = props;

    return (
        <h1 className="sm:my-8 font-bagel text-white text-2xl sm:text-3xl md:text-5xl 2xl:text-6xl">
            {text}
        </h1>
    )
}
