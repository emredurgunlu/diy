'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

const originalImages = [
  '/images/sticker.png',
  '/images/planner.png',
  '/images/ghlibli_anime.jpeg',
  '/images/bookmark.png',
];

// Duplicate images to ensure loop mode works with slidesPerView: 4
const images = [...originalImages, ...originalImages];

export default function HomeSwiper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full overflow-hidden py-8">
      {isMounted && (
        <Swiper
          modules={[Autoplay]}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="mySwiper" // Optional: for custom styling
          breakpoints={{
            // when window width is >= 0px
            0: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            // when window width is >= 768px (Tailwind md)
            768: {
              slidesPerView: 3,
              spaceBetween: 30
            },
            // when window width is >= 1024px (Tailwind lg)
            1024: {
              slidesPerView: 4,
              spaceBetween: 40
            },
          }}
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg shadow overflow-hidden">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-md"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
