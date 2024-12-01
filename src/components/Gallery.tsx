import React, { useState, useEffect } from 'react';
import { Camera, Play, Pause } from 'lucide-react';
import zamintData from '../data/zamint-ideology.json';

const ZamintGallery = () => {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (isAutoScroll) {
      intervalId = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % zamintData.zamintData.length);
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isAutoScroll]);

  const toggleAutoScroll = () => {
    setIsAutoScroll(!isAutoScroll);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Futuristic Overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-red-600 to-green-600 mix-blend-overlay" />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl shadow-2xl border-4 border-red-900">
            <img 
              src={`/MyImage/${zamintData.zamintData[currentSlide].image}`} 
              alt="Zamint Concept" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 transform scale-105 hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
              <div className="text-sm uppercase tracking-wide text-green-400">
                {zamintData.zamintData[currentSlide].concept}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">
              Zamint Order
            </h1>
            <p className="text-gray-300 leading-relaxed">
              {zamintData.zamintData[currentSlide].description}
            </p>
            
            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {zamintData.zamintData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-red-500 scale-125' 
                      : 'bg-green-900 hover:bg-green-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Auto-Scroll Control */}
        <button 
          onClick={toggleAutoScroll}
          className="absolute bottom-10 right-10 bg-black bg-opacity-50 border border-red-600 hover:bg-red-900 p-4 rounded-full transition-all duration-300 focus:outline-none"
        >
          {isAutoScroll ? <Pause color="green" /> : <Play color="red" />}
        </button>
      </div>
    </div>
  );
};

export default ZamintGallery;