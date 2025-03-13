import Image from 'next/image';

const About = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-purple-900 to-indigo-900 text-white py-20 px-4 md:px-16">
      {/* Background Elements */}
      <Image src="/Purple Cloud Cluster.png" alt="Cloud" className="absolute top-0 left-0 w-[522px] h-[311px] opacity-90" width={522} height={311} />
      <Image src="/Pink Star.png" alt="Star" className="absolute top-[38px] left-[360px] w-[108px] h-[100px] opacity-100" width={108} height={100} />
      <Image src="/Purple Glyph.png" alt="Glyph" className="absolute top-[-13px] left-[427px] w-[85px] h-[70px] opacity-100" width={85} height={70} />
      
      {/* Container */}
      <div className="max-w-6xl mx-auto text-center relative">
        {/* Section Title */}
        <h2 className="font-['Bagel Fat One'] text-4xl md:text-5xl font-bold">About HackCC</h2>
        
        {/* Description */}
        <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          A 100-person, 30-hour hackathon for community college students across California, hosted at Orange Coast College in Los Altos Hills, CA.
        </p>
        
        {/* Features */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-10 text-left max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold text-yellow-400">Event Features</h3>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start gap-3">
                <Image src="/Pink Paw.png" alt="Icon" width={30} height={30} className="w-6 h-6" />
                Fun, collaborative, and supportive community of hackers
              </li>
              <li className="flex items-start gap-3">
                <Image src="/Pink Paw.png" alt="Icon" width={30} height={30} className="w-6 h-6" />
                Interesting and educational talks and workshops
              </li>
              <li className="flex items-start gap-3">
                <Image src="/Pink Paw.png" alt="Icon" width={30} height={30} className="w-6 h-6" />
                Delicious catering throughout the event
              </li>
              <li className="flex items-start gap-3">
                <Image src="/Pink Paw.png" alt="Icon" width={30} height={30} className="w-6 h-6" />
                Great Prizes and more!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
