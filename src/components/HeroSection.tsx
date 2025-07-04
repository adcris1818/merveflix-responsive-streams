
import React from 'react';
import { Button } from './ui/button';
import { Play, Plus } from 'lucide-react';

interface HeroSectionProps {
  content?: {
    id: string;
    title: string;
    description: string;
    background_image?: string;
    poster_url?: string;
    genre?: string[];
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  const heroContent = content || {
    id: 'default',
    title: 'Welcome to MerFlix',
    description: 'Discover amazing movies and TV shows. Stream your favorites anytime, anywhere.',
    background_image: '/placeholder.svg',
    genre: ['Entertainment']
  };

  return (
    <div 
      className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroContent.background_image || heroContent.poster_url || '/placeholder.svg'})`
      }}
    >
      <div className="text-center text-white max-w-4xl px-4">
        <h1 className="text-6xl font-bold mb-4">{heroContent.title}</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{heroContent.description}</p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            <Play className="mr-2 h-5 w-5" />
            Play Now
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            <Plus className="mr-2 h-5 w-5" />
            My List
          </Button>
        </div>
      </div>
    </div>
  );
};
