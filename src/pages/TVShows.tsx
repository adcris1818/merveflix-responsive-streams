
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/ContentGrid';
import { FilterTabs } from '../components/FilterTabs';
import { Footer } from '../components/Footer';

const TVShows = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filterTabs = [
    { id: 'all', label: 'All Shows', count: 850 },
    { id: 'drama', label: 'Drama', count: 198 },
    { id: 'comedy', label: 'Comedy', count: 145 },
    { id: 'action', label: 'Action', count: 124 },
    { id: 'documentary', label: 'Documentary', count: 89 },
    { id: 'reality', label: 'Reality', count: 67 },
    { id: 'animation', label: 'Animation', count: 78 },
    { id: 'crime', label: 'Crime', count: 95 }
  ];

  // Mock TV show data
  const tvShows = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: `TV Series ${i + 1}`,
    thumbnail: "/placeholder.svg",
    genre: ['Drama', 'Comedy', 'Action', 'Documentary', 'Reality', 'Animation', 'Crime'][Math.floor(Math.random() * 7)],
    year: 2020 + Math.floor(Math.random() * 4),
    rating: ['TV-PG', 'TV-14', 'TV-MA'][Math.floor(Math.random() * 3)],
    duration: `${1 + Math.floor(Math.random() * 8)} Season${Math.floor(Math.random() * 8) > 0 ? 's' : ''}`,
    description: `A captivating series that explores the depths of human nature through compelling storytelling.`
  }));

  const filteredShows = activeFilter === 'all' 
    ? tvShows 
    : tvShows.filter(show => show.genre.toLowerCase() === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">TV Shows</h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Binge-watch the latest series and discover timeless classics. From award-winning dramas 
              to laugh-out-loud comedies, find your next obsession here.
            </p>
          </div>

          {/* Filter Tabs */}
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />

          {/* TV Shows Grid */}
          <ContentGrid
            items={filteredShows}
            title={`${filteredShows.length} TV Shows`}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TVShows;
