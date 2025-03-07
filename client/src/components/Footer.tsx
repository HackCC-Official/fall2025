import Image from "next/image"
export default function Footer() {
    return (
        <div className="wrapper">
            <div className="w-[100%] h-[150px] justify-around text-white bg-[#021442] flex items-center ">
                <Image src={'/logo.png'} width={256} height={181} className="w-[50px] h-[auto] sm:w-[60px]" alt="log"></Image>
                <div className="flex items-center justify-around w-[70%] sm:justify-end">
                    <div className="flex w-[50%] justify-around sm:w-[175px]">
                        <Image src={'/discord.png'} width={40} height={40} className=" w-[30px] sm:w-[40px] h-[auto]" alt="discord"></Image>
                        <Image src={'/instagram.png'} width={40} height={40} className="w-[30px] sm:w-[40px] h-[auto]" alt="instagram"></Image>
                        <Image src={'/twitter.png'} width={40} height={40} className="w-[30px] sm:w-[40px] h-[auto]" alt="twitter"></Image>
                    </div>
                    <p className="text-sm sm:ml-3 text-[#A9ACB0]">@2025 HackCC</p>
                </div>
            </div>
        </div>
    )
}