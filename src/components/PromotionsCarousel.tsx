import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
    title: "Game Day",
    subtitle: "NASDEC COMPLEX LUSAKA",
    description: "AUGUST 27-28\n14:00, 12:00 & 14:00,16:00\n& 18:00HRS",
    background: "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500",
    image: "/lovable-uploads/bf3fea44-868d-4f2b-a215-da56de06e9df.png"
  },
  {
    id: 2,
    title: "Transact & Win",
    subtitle: "Easter weekend special",
    description: "Locations: Cheers Gold Crest Mall | Chrismar Hotel | Hot Spot Pub & Grill",
    background: "bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500",
    image: "/lovable-uploads/21dc93b2-99ea-47fa-8366-fd5d8c8870d6.png"
  },
  {
    id: 3,
    title: "Winners",
    subtitle: "of K20 airtime",
    description: "Patience Ng'andwe\nPhiri John",
    background: "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600",
    image: "/lovable-uploads/b101096f-d8a9-44c9-8b8d-daec259763e3.png"
  }
];

const PromotionsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="relative group">
      {/* Main Carousel Container */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 via-lavender/30 to-accent/50 rounded-3xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
        
        <div className="relative glass-card rounded-3xl overflow-hidden border border-white/10">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {promotions.map((promo, index) => (
              <div key={promo.id} className="w-full flex-shrink-0 relative">
                <div className="relative h-40 overflow-hidden">
                  {/* Image */}
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Featured</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{promo.title}</h3>
                        <p className="text-xs text-muted-foreground">{promo.subtitle}</p>
                      </div>
                      <button className="glass px-3 py-1.5 rounded-xl border border-white/20 hover:border-primary/40 transition-all text-xs font-semibold text-foreground hover:text-primary">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Modern Style */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 glass-strong text-foreground rounded-xl flex items-center justify-center hover:bg-white/20 transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/20"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 glass-strong text-foreground rounded-xl flex items-center justify-center hover:bg-white/20 transition-all z-10 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 border border-white/20"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Progress Bar Style Indicator */}
      <div className="flex justify-center gap-2 mt-3">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: index === currentIndex ? '24px' : '8px' }}
          >
            <div className="absolute inset-0 bg-white/20" />
            {index === currentIndex && (
              <div 
                className="absolute inset-0 bg-gradient-to-r from-primary to-lavender rounded-full"
                style={{
                  animation: 'progress 5s linear'
                }}
              />
            )}
            {index !== currentIndex && (
              <div className="absolute inset-0 bg-white/30 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default PromotionsCarousel;