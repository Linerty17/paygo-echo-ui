
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Promotion {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  background: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: "AUGUST 27-28",
    subtitle: "Mobile Money",
    description: "AUGUST 27-28\n14:00, 2:00 & 14:00,16:00\n48:00DHRS",
    background: "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500"
  },
  {
    id: 2,
    title: "Winners",
    subtitle: "of K20 airtime",
    description: "Patience Ng'andwe\nPhiri John",
    background: "bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500"
  },
  {
    id: 3,
    title: "Transact & Win",
    subtitle: "",
    description: "Locations: Cheers Gold Crest Mall | Chrismar Hotel | Hot Spot Pub & Grill\n\nAll customers who pay with PayGo in store will stand a chance to win great prizes.",
    background: "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600"
  }
];

const PromotionsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {promotions.map((promo) => (
            <div key={promo.id} className="w-full flex-shrink-0">
              <div className={`${promo.background} p-6 text-white min-h-[200px] flex flex-col justify-between relative overflow-hidden`}>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                  {promo.subtitle && (
                    <p className="text-lg opacity-90 mb-2">{promo.subtitle}</p>
                  )}
                  <p className="text-sm opacity-80 whitespace-pre-line">{promo.description}</p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-20 text-white rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-20 text-white rounded-full flex items-center justify-center hover:bg-opacity-40 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionsCarousel;
