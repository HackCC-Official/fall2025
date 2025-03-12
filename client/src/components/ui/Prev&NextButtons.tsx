type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
import Image from "next/image"
//<Image src={"/arrowRight.png"} width={16} height={12} alt="Prev" quality={80}></Image>
//<Image src={"/arrowRight.png"}  alt="Prev" quality={100}></Image>
export const NextButton = (props:ButtonProps) => {
    return(
        <button {...props}>
            <Image fill src="/arrowRight.png"  sizes={'100px'} alt="Prev" quality={100} />
        </button>
    )
}
export const PrevButton = (props:ButtonProps) =>{
    return(
        <button   {...props}>
            <Image fill src="/arrowLeft.png"  sizes={'100px'} alt="Prev" quality={100} />
        </button>
    )
}