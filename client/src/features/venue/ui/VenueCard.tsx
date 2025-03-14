
import Image from 'next/image'
import foothill from '../../../../public/foothill.png'
export default function VenueCard() {
    return (
        <div className='-bottom-[150px] absolute flex justify-center items-end border-black w-[100%] h-full'>
            <div className='lg:bottom-[185px] 2xl:bottom-[160px] lg:left-20 2xl:left-[300px] z-30 absolute bg-white shadow-2xl p-4 rounded-[20px] w-[80%] sm:w-[400px] 2xl:w-[400px] max-w-[350px] 2xl:max-w-[400px] h-auto 2xl:h-[490px]'>
                <h2 className={` text-[2rem] font-bagel mb-4 2xl:px-2 text-[2.5rem]`}>Venue</h2>
                <Image src={foothill} alt='foothill' className='mx-auto 2xl:px-2 rounded-lg w-[100%] h-auto'></Image>
                <div className={`font-mont 2xl:px-2`}>
                    <h3 className='my-4 font-bold text-[1.2rem] 2xl:text-[1.5rem]'>Foothill College</h3>
                    <p className='text-[#696E75] 2xl:text-[1.3rem]'>12345 El Monte Road</p>
                    <p className='text-[#696E75] 2xl:text-[1.3rem]'>Los Altos Hills, CA 94022</p>
                    <div className='flex flex-wrap mt-4 w-full text-[0.8rem] text-hoverpurple 2xl:text-[1rem] pointer-events-auto'>
                        <a className='hover:underline' href="https://www.google.com/maps?sca_esv=2a239d77fdcafbe4&output=search&q=foothill+college&source=lnms&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpIgVFCTcbZI9VMGzNoV0iOZkckJJygdiLH6_g992ly-MejtXB7Ey3BdJG-rocg1ctah1xtdI8HyNrLXygxsGrFwnu1kvZFFU0jhE6qlyFaIHKZNT6NwXUvg_EJ_3RFvEG-Z4gpZtnOHXUo9n9liPlIRqJWkeF9JBLZSzASMh0-bd5uhNMlow2YcImJ3EHCr0mZ_2OFA&entry=mc&ved=1t:200715&ictx=111">Get Directions</a>      
                    </div>
                </div>
            </div>
        </div>
    )
}