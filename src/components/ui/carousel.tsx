'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect } from 'react';
import Image from 'next/image';

const images = [
  "/bg1.png",
  "/bg2.png",
  "/bg3.png"
];

export default function Carousel() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="relative md:top-0 md:left-0 md:w-full md:z-0 mt-12 md:mt-0">
      {/* Carousel Images */}
      <div
        ref={sliderRef}
        className="keen-slider h-[250px] md:h-[550px]"
      >
        {images.map((src, index) => (
          <div key={index} className="keen-slider__slide h-full">
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              width={1800}
              height={500}
              className="w-full h-full object-fit"
            />
          </div>
        ))}
      </div>

      {/* Static Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10">
        <div className="bg-bg/30 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow md:mb-4 text-center">Everything You Need, All in One Place</h1>
          <p className="text-md md:text-xl mb-6 max-w-xl drop-shadow text-center">
        Discover top deals, latest trends, and must-have products. Shop smart, live better.
          </p>
        </div>
      </div>
    </div>
  );
}