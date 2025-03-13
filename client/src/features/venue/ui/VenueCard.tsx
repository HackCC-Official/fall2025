import { bagel_Fat_One, montserrat_Alternates } from '../../../app/styles/fonts'
import Image from 'next/image'
import foothill from '../../../../public/foothill.png'
export default function VenueCard() {
    return (
        <div className='-bottom-[60px] absolute flex justify-center items-end border-black w-[100%] h-full'>
            <div className='2xl:bottom-[150px] 2xl:left-20 z-30 absolute bg-white shadow-2xl p-4 sm:p-6 2xl:p-10 rounded-[20px] w-[90%] sm:w-[600px] 2xl:w-[650px] max-w-[320px] sm:max-w-[500px] 2xl:max-w-none h-auto sm:h-[600px] 2xl:h-[850px]'>
                <h2 className={` text-[2rem] ${bagel_Fat_One.className} mb-4 2xl:text-[3rem]`}>Venue</h2>
                <Image src={foothill} alt='foothill' className='mx-auto rounded-lg w-[100%] h-auto'></Image>
                <div className={`${montserrat_Alternates.className}`}>
                    <h3 className='my-4 sm:my-6 font-bold text-[1.2rem] sm:text-[1.8rem] 2xl:text-[2.5rem]'>Foothill College</h3>
                    <p className='text-[#696E75] sm:text-[1.2rem] 2xl:text-[2.2rem]'>12345 El Monte Road</p>
                    <p className='text-[#696E75] sm:text-[1.2rem] 2xl:text-[2.2rem]'>Los Altos Hills, CA 94022</p>
                    <div className='flex flex-wrap mt-4 sm:mt-6 w-full text-[0.8rem] text-hoverpurple pointer-events-auto'>
                        <a className='sm:text-[1.2rem] 2xl:text-[1.7rem] hover:underline' href="https://www.google.com/maps?sca_esv=2a239d77fdcafbe4&output=search&q=foothill+college&source=lnms&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpIgVFCTcbZI9VMGzNoV0iOZkckJJygdiLH6_g992ly-MejtXB7Ey3BdJG-rocg1ctah1xtdI8HyNrLXygxsGrFwnu1kvZFFU0jhE6qlyFaIHKZNT6NwXUvg_EJ_3RFvEG-Z4gpZtnOHXUo9n9liPlIRqJWkeF9JBLZSzASMh0-bd5uhNMlow2YcImJ3EHCr0mZ_2OFA&entry=mc&ved=1t:200715&ictx=111">Get Directions</a>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}