import Image from "next/image"
export default function Footer() {
    return (
        <div className="wrapper">
            <div className="flex justify-around items-center bg-[#021442] w-[100%] h-[150px] text-white">
                <Image src={'/logo.png'} width={256} height={181} className="w-[50px] sm:w-[60px] h-[auto]" alt="log"></Image>
                <div className="flex justify-around sm:justify-end items-center w-[70%]">
                    <div className="flex justify-around w-[50%] sm:w-[175px]">
                        <Image src={'/discord.png'} width={40} height={40} className="w-[30px] sm:w-[40px] h-[auto]" alt="discord"></Image>
                        <Image src={'/instagram.png'} width={40} height={40} className="w-[30px] sm:w-[40px] h-[auto]" alt="instagram"></Image>
                        <Image src={'/twitter.png'} width={40} height={40} className="w-[30px] sm:w-[40px] h-[auto]" alt="twitter"></Image>
                    </div>
                    <p className="sm:ml-3 text-[#A9ACB0] text-sm">© 2025 HackCC</p>
                </div>
            </div>
        </div>
    )
}