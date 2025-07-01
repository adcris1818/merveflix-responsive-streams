
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/ContentGrid';
import { Footer } from '../components/Footer';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Mock search results
  const allContent = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Search Result ${i + 1}`,
    thumbnail: "/placeholder.svg",
    genre: ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi'][Math.floor(Math.random() * 7)],
    year: 2020 + Math.floor(Math.random() * 4),
    rating: ['PG', 'PG-13', 'R', 'TV-14', 'TV-MA'][Math.floor(Math.random() * 5)],
    duration: `${90 + Math.floor(Math.random() * 60)} min`,
    description: `An engaging piece of content that matches your search criteria.`
  }));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = allContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.genre.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Search</h1>
            
            {/* Search Input */}
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for movies, TV shows, documentaries and more..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <ContentGrid
              items={searchResults}
              title={searchResults.length > 0 ? `${searchResults.length} results for "${searchQuery}"` : `No results found for "${searchQuery}"`}
            />
          )}

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Popular Searches</h2>
                <div className="flex flex-wrap gap-3">
                  {['Action Movies', 'Comedy Series', 'Documentaries', 'Horror Films', 'Sci-Fi', 'Romance'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
