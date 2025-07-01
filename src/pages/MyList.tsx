
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/ContentGrid';
import { Footer } from '../components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const MyList = () => {
  // Mock saved content
  const savedMovies = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Saved Movie ${i + 1}`,
    thumbnail: "/placeholder.svg",
    genre: ['Action', 'Comedy', 'Drama', 'Thriller'][Math.floor(Math.random() * 4)],
    year: 2020 + Math.floor(Math.random() * 4),
    rating: ['PG', 'PG-13', 'R'][Math.floor(Math.random() * 3)],
    duration: `${90 + Math.floor(Math.random() * 60)} min`,
    description: `A movie you've saved to watch later.`
  }));

  const savedTVShows = Array.from({ length: 8 }, (_, i) => ({
    id: i + 20,
    title: `Saved TV Show ${i + 1}`,
    thumbnail: "/placeholder.svg",
    genre: ['Drama', 'Comedy', 'Action', 'Documentary'][Math.floor(Math.random() * 4)],
    year: 2020 + Math.floor(Math.random() * 4),
    rating: ['TV-PG', 'TV-14', 'TV-MA'][Math.floor(Math.random() * 3)],
    duration: `${1 + Math.floor(Math.random() * 5)} Season${Math.floor(Math.random() * 5) > 0 ? 's' : ''}`,
    description: `A TV show you've added to your watchlist.`
  }));

  const continueWatching = Array.from({ length: 6 }, (_, i) => ({
    id: i + 30,
    title: `Continue Watching ${i + 1}`,
    thumbnail: "/placeholder.svg",
    genre: ['Drama', 'Comedy', 'Action'][Math.floor(Math.random() * 3)],
    year: 2023,
    rating: 'TV-14',
    duration: '45 min',
    progress: 25 + Math.floor(Math.random() * 50),
    description: `Resume where you left off.`
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My List</h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Your personal collection of saved movies, TV shows, and content you want to watch.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-900 mb-8">
              <TabsTrigger value="all" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600">
                All ({savedMovies.length + savedTVShows.length + continueWatching.length})
              </TabsTrigger>
              <TabsTrigger value="continue" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600">
                Continue Watching ({continueWatching.length})
              </TabsTrigger>
              <TabsTrigger value="movies" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600">
                Movies ({savedMovies.length})
              </TabsTrigger>
              <TabsTrigger value="shows" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600">
                TV Shows ({savedTVShows.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-12">
              {continueWatching.length > 0 && (
                <ContentGrid
                  items={continueWatching}
                  title="Continue Watching"
                />
              )}
              <ContentGrid
                items={savedMovies}
                title="Saved Movies"
              />
              <ContentGrid
                items={savedTVShows}
                title="Saved TV Shows"
              />
            </TabsContent>

            <TabsContent value="continue">
              <ContentGrid
                items={continueWatching}
                title={`Continue Watching (${continueWatching.length})`}
              />
            </TabsContent>

            <TabsContent value="movies">
              <ContentGrid
                items={savedMovies}
                title={`Saved Movies (${savedMovies.length})`}
              />
            </TabsContent>

            <TabsContent value="shows">
              <ContentGrid
                items={savedTVShows}
                title={`Saved TV Shows (${savedTVShows.length})`}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyList;
