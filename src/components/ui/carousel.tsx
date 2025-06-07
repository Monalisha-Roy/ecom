'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect } from 'react';

const images = [
  "/img1.jpg",
  "/img2.jpg",
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
    <div className="relative">
      {/* Carousel Images */}
      <div ref={sliderRef} className="keen-slider mt-28 md:mt-0 h-[250px] md:h-[500px]">
        {images.map((src, index) => (
          <div key={index} className="keen-slider__slide h-full">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Static Text Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4 z-10">
        <h1 className="text-3xl md:text-5xl font-bold drop-shadow md:mb-4">Everything You Need, All in One Place</h1>
        <p className="text-md md:text-xl mb-6 max-w-xl drop-shadow">
          Discover top deals, latest trends, and must-have products. Shop smart, live better.
        </p>
        
      </div>
    </div>
  );
}
