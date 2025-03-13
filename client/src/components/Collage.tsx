// Collage.tsx
import React from "react";

// Images (path>> public/assets)
const images = [
  "/public/BG Image.png",
  "/public/Baloon Cat 4.png",
  "/public/Hot Air Balloon.png",
  "/public/Moon.png",
  "/public/Pink Paw 2.png",
];

const Collage = () => {
  return (
    <section className="py-16 bg-[#240046] text-white text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        What Past Attendees Have Said
      </h2>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-12">
        {images.map((src, index) => (
          <div key={index} className="relative group">
            <img
              src={src}
              alt={`Collage Image ${index + 1}`}
              className="rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collage;
