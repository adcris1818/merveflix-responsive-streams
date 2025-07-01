
import React from 'react';
import { Play, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface HeroContent {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  genre: string;
  year: number;
  rating: string;
  duration: string;
}

interface HeroSectionProps {
  content: HeroContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  return (
    <section className="relative h-screen flex items-center justify-start">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${content.backgroundImage})`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-20 px-4 md:px-8 lg:px-12 xl:px-16 max-w-2xl">
        <div className="space-y-4 md:space-y-6">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            {content.title}
          </h1>
          
          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm md:text-base text-gray-300">
            <span className="bg-gray-800 px-2 py-1 rounded text-xs">{content.rating}</span>
            <span>{content.year}</span>
            <span>{content.genre}</span>
            <span>{content.duration}</span>
          </div>
          
          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-xl">
            {content.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              className="bg-white text-black hover:bg-gray-200 font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 text-lg"
              size="lg"
            >
              <Play className="h-6 w-6 fill-current" />
              Play
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-400 text-white hover:bg-gray-800 font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 text-lg bg-gray-700/70"
              size="lg"
            >
              <Plus className="h-6 w-6" />
              My List
            </Button>
          </div>
        </div>
      </div>
      
      {/* Fade to black at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
};
