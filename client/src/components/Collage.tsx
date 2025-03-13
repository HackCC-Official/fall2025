import React from 'react';
import Image from 'next/image';
import styles from './Collage.module.css';

const images = [
  { src: '/public/image1.png', width: 208, height: 144, x: 319, y: 320 },
  { src: '/public/image2.png', width: 344, height: 232, x: -49, y: 232 },
  { src: '/public/image3.png', width: 344, height: 232, x: 1151, y: 232 },
  { src: '/public/image4.png', width: 344, height: 232, x: 551, y: 232 },
  { src: '/public/image5.png', width: 279, height: 285, x: 1004, y: -16 },
  { src: '/public/image6.png', width: 46, height: 53, x: 310, y: 126 },
  { src: '/public/image7.png', width: 221, height: 185, x: 606, y: 448 },
  { src: '/public/image8.png', width: 104, height: 72, x: 919, y: 232 },
  { src: '/public/image9.png', width: 208, height: 144, x: 1089, y: 488 },
  { src: '/public/image10.png', width: 104, height: 72, x: 791, y: 488 },
  { src: '/public/image11.png', width: 144, height: 208, x: 383, y: 488 },
  { src: '/public/image12.png', width: 144, height: 208, x: 921, y: 488 },
  { src: '/public/image13.png', width: 208, height: 136, x: 919, y: 328 },
  { src: '/public/image14.png', width: 144, height: 144, x: 719, y: 64 },
  { src: '/public/image15.png', width: 144, height: 144, x: 383, y: 152 },
];

const Collage = () => {
  return (
    <div className={styles.collageContainer}>
      {images.map((img, index) => (
        <Image
          key={index}
          src={img.src}
          width={img.width}
          height={img.height}
          alt={`Collage Image ${index + 1}`}
          className={styles.collageImage}
          style={{ left: img.x, top: img.y, position: 'absolute' }}
        />
      ))}
    </div>
  );
};

export default Collage;
