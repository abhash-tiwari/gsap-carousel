'use client'
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import gsap from 'gsap';

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef(null);
  const totalSlides = 5;
  const slideRefs = useRef([]);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % totalSlides);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, totalSlides]);
  
  useEffect(() => {
    if (!sliderRef.current) return;
    const tl = gsap.timeline();
    
    tl.to(sliderRef.current, {
      x: `${-activeSlide * 20}%`,
      duration: 0.8,
      ease: "power2.out"
    });
    
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      
      let distance = Math.abs(index - activeSlide);
      if (distance > Math.floor(totalSlides / 2)) {
        distance = totalSlides - distance;
      }
      
      const scale = 1 - (distance * 0.15);
      const opacity = 1 - (distance * 0.2);
      const zIndex = 5 - distance;
      
      tl.to(slide, {
        scale: scale,
        opacity: opacity,
        zIndex: zIndex,
        duration: 0.8,
        ease: "power2.out"
      }, "<");
    });
  }, [activeSlide]);
  
  const handleDotClick = (index) => {
    setActiveSlide(index);
  };
  
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };
  
  const images = [
    '/images/image1.jpg',
    '/images/image2.jpg',
    '/images/image3.jpg',
    '/images/image4.jpg',
    '/images/image5.jpg',
  ];
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>WWE Gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <h1 className="text-3xl font-bold mb-8">WWE 2K Gallery</h1>
      
      <div className="w-full max-w-5xl relative overflow-hidden px-4">
        <div className="flex items-center justify-center relative h-80 overflow-visible">
          <div 
            ref={sliderRef}
            className="flex items-center absolute"
            style={{ 
              width: `${totalSlides * 20}%`,
              left: '40%'
            }}
          >
            {images.map((src, index) => (
              <div 
                key={index}
                ref={el => slideRefs.current[index] = el}
                className="w-1/5 px-2 flex-shrink-0 cursor-pointer"
                onClick={() => setActiveSlide(index)}
                style={{
                  opacity: index === activeSlide ? 1 : 0.7,
                  zIndex: index === activeSlide ? 5 : 0
                }}
              >
                <div className="relative w-full h-60 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-4 space-y-4">
          <div className="flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeSlide ? "w-4 bg-black" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={togglePlayPause}
            className="flex items-center justify-center w-16 h-16 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}