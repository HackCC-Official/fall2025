import React from "react";

/**
 * About section for HackCC event.
 * Includes event details and key features.
 */
const About = () => {
  return (
    <section className="py-12 px-6 text-center text-white">
      <h2 className="text-4xl font-bold mb-4">About HackCC</h2>
      <p className="max-w-2xl mx-auto text-lg">
        A 100-person, 30-hour hackathon for community college students across California, hosted at Orange Coast College in Los Altos Hills, CA.
      </p>

      {/* Event Features */}
      <div className="mt-6">
        <ul className="list-none space-y-2">
          <li>✅ Fun, collaborative, and supportive hacker community</li>
          <li>🎤 Talks and workshops from industry experts</li>
          <li>🍽️ Delicious catering throughout the event</li>
          <li>🏆 Prizes and more surprises!</li>
        </ul>
      </div>
    </section>
  );
};

export default About;
