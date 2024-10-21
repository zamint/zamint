import { useState, useEffect, useRef } from 'react';
import imageData from '../data/images.json'; // Adjust the path if needed

const Gallery = () => {
  const { images } = imageData;

  interface Image {
    src: string;
    text: string;
  }
  
// Function to shuffle an array
const shuffleArray = (array: Image[]): Image[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


  const [items, setItems] = useState(Array.from({ length: images.length }));
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [showText, setShowText] = useState(true); // State to control text visibility
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userScrollingRef = useRef(false);

  // Shuffle images on mount
  useEffect(() => {
    const shuffledImages = shuffleArray([...images]); // Shuffle images
    setItems(shuffledImages);

    // Start auto-scrolling after text animation
    const textTimeout = setTimeout(() => {
      setShowText(false); // Hide text after some time
      startAutoScrollWithDelay();
    }, 3000); // Duration for which the text is displayed

    return () => clearTimeout(textTimeout); // Cleanup timeout on unmount
  }, []);

  // Function to load more images when reaching the bottom
  const loadMoreImages = () => {
    setItems((prevItems) => [...prevItems, ...Array.from({ length: images.length })]);
  };

  // Function to handle faster auto-scrolling
  const autoScroll = () => {
    window.scrollBy({
      top: 3,
      behavior: 'smooth',
    });
  };

  // Function to start auto-scrolling after the delay
  const startAutoScroll = () => {
    if (!scrollIntervalRef.current && !userScrollingRef.current) {
      scrollIntervalRef.current = setInterval(autoScroll, 6);
    }
  };

  // Function to stop auto-scrolling
  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Function to start the auto-scrolling after 3-second delay
  const startAutoScrollWithDelay = () => {
    delayTimeoutRef.current = setTimeout(() => {
      startAutoScroll();
    }, 2000); // Wait for 2 seconds before starting the scroll
  };

  // Function to handle user scroll actions
  const handleUserScroll = () => {
    userScrollingRef.current = true; // Set user scrolling to true
    stopAutoScroll(); // Stop auto-scroll

    // Clear any previous manual scroll timeouts
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    // Set isAutoScrolling to false since user is scrolling
    setIsAutoScrolling(false);

    // After 5 seconds of inactivity, re-enable auto-scroll
    manualScrollTimeoutRef.current = setTimeout(() => {
      userScrollingRef.current = false;
      if (isAutoScrolling) {
        startAutoScroll();
      }
    }, 5000);
  };

  // Toggle auto-scrolling when the button is clicked
  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
    setIsAutoScrolling(!isAutoScrolling);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadMoreImages();
      }
    };

    const handleUserInteraction = () => {
      handleUserScroll();
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      stopAutoScroll();
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  const getAlignmentClass = (index: number) => {
    if (index % 3 === 0) return 'justify-center';
    if (index % 3 === 1) return 'justify-end';
    return 'justify-start';
  };

  const getTextPositionClass = (index: number) => {
    if (index % 3 === 0) return 'text-center';
    if (index % 3 === 1) return 'ml-4 text-right';
    return 'mr-4 text-left';
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <h1 className="text-6xl font-bold text-white opacity-100 animate-fade-out">
            Zamint
          </h1>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-green-500 z-0" />
      <div className="absolute inset-0 bg-black opacity-90 z-10" />
      <div className="relative z-20">
        <div className="flex flex-col items-center gap-10 p-[25px]">
          {items.map((_, index) => (
            <div
              key={index}
              className={`flex items-center w-full max-w-screen-lg h-[350px] overflow-hidden rounded-lg ${getAlignmentClass(index)}`}
            >
              <img
                src={`/MyImage/${images[index % images.length].src}`} // Dynamically load image from MyImage folder
                alt={`Image ${index + 1}`}
                className="w-80 h-80 object-cover transform transition-transform duration-300 hover:scale-105"
              />
              <p className={`absolute ${getTextPositionClass(index)} bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xl py-4 px-6 uppercase tracking-wide opacity-0 transition-opacity duration-500 delay-100 hover:opacity-100`}>
                {images[index % images.length].text}
              </p>
            </div>
          ))}
        </div>

        <div className="fixed bottom-10 right-10">
          <button
            onClick={toggleAutoScroll}
            className="px-6 py-3 text-white bg-transparent font-semibold rounded-lg shadow-md focus:outline-none"
          >
            <i className={`fas ${isAutoScrolling ? 'fa-pause' : 'fa-play'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
