// About.tsx
import React from "react";

const About = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#6A1B9A] to-[#311B92] text-white py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">About HackCC</h2>

        {/* Description */}
        <p className="text-lg md:text-xl leading-relaxed">
          A 100-person, 30-hour hackathon for community college students across
          California, hosted at Orange Coast College in Los Altos Hills, CA.
        </p>

        <p className="text-md md:text-lg mt-4">
          HackCC is a fun, exciting, and lively event that allows
          California-based community college students to gain hands-on
          experience building and shipping products. Whether you are a
          first-time coder or an experienced hacker, this event is for you!
        </p>

        <div className="mt-6 text-left flex flex-col items-center">
          <ul className="list-disc space-y-2 text-lg">
            <li>🤝 Fun, collaborative, and supportive community of hackers</li>
            <li>📚 Interesting and educational talks and workshops</li>
            <li>🍕 Delicious catering throughout the event</li>
            <li>🏆 Great prizes and more!</li>
          </ul>
        </div>
      </div>

      {/* Background graphics */}
      <img
        src="/public/Pink Cloud Cluster.png"
        alt="Decorative cloud"
        className="absolute top-10 left-5 w-20 opacity-70"
      />
      <img
        src="/public/Purple Paw.png"
        alt="Decorative paw"
        className="absolute bottom-10 right-5 w-24 opacity-70"
      />
    </section>
  );
};

export default About;
