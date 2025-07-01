
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/ContentGrid';
import { FilterTabs } from '../components/FilterTabs';
import { Footer } from '../components/Footer';

const Movies = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filterTabs = [
    { id: 'all', label: 'All Movies', count: 1250 },
    { id: 'action', label: 'Action', count: 245 },
    { id: 'comedy', label: 'Comedy', count: 189 },
    { id: 'drama', label: 'Drama', count: 312 },
    { id: 'thriller', label: 'Thriller', count: 156 },
    { id: 'horror', label: 'Horror', count: 98 },
    { id: 'romance', label: 'Romance', count: 134 },
    { id: 'sci-fi', label: 'Sci-Fi', count: 87 }
  ];

  // Mock movie data
  const movies = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Movie Title ${i + 1}`,
    thumbnail: "/placeholder.svg",
    genre: ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi'][Math.floor(Math.random() * 7)],
    year: 2020 + Math.floor(Math.random() * 4),
    rating: ['PG', 'PG-13', 'R', 'NC-17'][Math.floor(Math.random() * 4)],
    duration: `${90 + Math.floor(Math.random() * 60)} min`,
    description: `An engaging ${['action-packed', 'hilarious', 'dramatic', 'thrilling', 'terrifying', 'romantic', 'futuristic'][Math.floor(Math.random() * 7)]} movie that will keep you entertained from start to finish.`
  }));

  const filteredMovies = activeFilter === 'all' 
    ? movies 
    : movies.filter(movie => movie.genre.toLowerCase() === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Movies</h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Discover thousands of movies from every genre. From blockbuster hits to indie gems, 
              we have something for every movie lover.
            </p>
          </div>

          {/* Filter Tabs */}
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />

          {/* Movies Grid */}
          <ContentGrid
            items={filteredMovies}
            title={`${filteredMovies.length} Movies`}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;
