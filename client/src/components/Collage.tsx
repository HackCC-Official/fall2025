import React from "react";

/**
 * Collage section displaying event photos.
 */
const Collage = () => {
  // Array of image URLs (Path >>/public/assets/)
  const images = [
    "/assets/photo1.jpg",
    "/assets/photo2.jpg",
    "/assets/photo3.jpg",
    "/assets/photo4.jpg",
  ];

  return (
    <section className="py-12 px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-6">Event Highlights</h2>

      {/* Grid layout for photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`HackCC event ${index + 1}`} className="rounded-lg shadow-lg w-full h-auto object-cover" />
        ))}
      </div>
    </section>
  );
};

export default Collage;
