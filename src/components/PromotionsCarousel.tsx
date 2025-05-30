
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  background: string;
  image: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: "Mobile Money",
    subtitle: "AUGUST 27-28",
    description: "14:00, 2:00 & 14:00,16:00\n48:00HRS",
    background: "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500",
    image: "/lovable-uploads/62ce7959-bd54-4bc5-bc0a-dea92ac2c48b.png"
  },
  {
    id: 2,
    title: "Winners",
    subtitle: "of K20 airtime",
    description: "Patience Ng'andwe\nPhiri John",
    background: "bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500",
    image: "/lovable-uploads/3215a8f1-8330-4c5c-8a1f-ecb153443061.png"
  },
  {
    id: 3,
    title: "Transact & Win",
    subtitle: "",
    description: "Locations: Cheers Gold Crest Mall | Chrismar Hotel | Hot Spot Pub & Grill\n\nAll customers who pay with PayGo in store will stand a chance to win great prizes.",
    background: "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600",
    image: "/lovable-uploads/40c2e0a5-1956-4bf8-b7b6-0e6f0888f1f6.png"
  }
];

const PromotionsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {promotions.map((promo) => (
            <div key={promo.id} className="w-full flex-shrink-0">
              <div className="relative min-h-[250px] rounded-2xl overflow-hidden">
                <img 
                  src={promo.image} 
                  alt={promo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-30 text-white rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionsCarousel;
