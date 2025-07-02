
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  genre: string;
  year: number;
  rating: string;
  progress?: number;
}

interface ContentCarouselProps {
  title: string;
  items: ContentItem[];
}

export const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, items }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
        {title}
      </h2>
      
      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>
      
      <Button
        variant="ghost"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>
      
      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 group/item cursor-pointer"
          >
            <Card className="bg-transparent border-none overflow-hidden">
              <CardContent className="p-0 relative">
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover/item:scale-105"
                  />
                  
                  {/* Progress Bar for Continue Watching */}
                  {item.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg">
                      <div 
                        className="h-full bg-red-600 rounded-b-lg"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200 p-2 rounded-full"
                      >
                        <Play className="h-4 w-4 fill-current" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-400 text-white hover:bg-gray-800 p-2 rounded-full bg-gray-700/70"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Content Info */}
                <div className="pt-2 space-y-1">
                  <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 group-hover/item:text-gray-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span className="bg-gray-800 px-1 py-0.5 rounded text-xs">{item.rating}</span>
                    <span>{item.year}</span>
                    <span>{item.genre}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
