
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentCarousel } from '../components/ContentCarousel';
import { Footer } from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/auth/AuthProvider';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const MyList = () => {
  const { user } = useAuthContext();

  const { data: watchlistContent = [], isLoading } = useQuery({
    queryKey: ['my-watchlist', user?.id],
    queryFn: async (): Promise<Content[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_watchlist')
        .select(`
          content:content_id (
            id,
            title,
            thumbnail_url,
            poster_url,
            genre,
            release_date,
            age_rating,
            duration,
            season_count,
            description,
            type
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.content).filter(Boolean) as Content[] || [];
    },
    enabled: !!user,
  });

  // Mock data for demonstration - replace with actual watch history
  const continueWatching = watchlistContent.slice(0, 6).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'Entertainment',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: item.type === 'movie' ? `${item.duration || 120} min` : `${item.season_count || 1} Season`,
    progress: Math.floor(Math.random() * 80) + 10,
    description: item.description || 'No description available.'
  }));

  const recentlyAdded = watchlistContent.slice(6, 14).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'Entertainment',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: item.type === 'movie' ? `${item.duration || 120} min` : `${item.season_count || 1} Season`,
    description: item.description || 'No description available.'
  }));

  const favoriteMovies = watchlistContent.filter(item => item.type === 'movie').slice(0, 8).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'Movie',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: `${item.duration || 120} min`,
    description: item.description || 'No description available.'
  }));

  const favoriteTVShows = watchlistContent.filter(item => item.type === 'tv_show').slice(0, 8).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'TV Show',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: `${item.season_count || 1} Season`,
    progress: Math.floor(Math.random() * 80) + 10,
    description: item.description || 'No description available.'
  }));

  const watchLater = watchlistContent.slice(0, 10).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'Entertainment',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: item.type === 'movie' ? `${item.duration || 120} min` : `${item.season_count || 1} Season`,
    description: item.description || 'No description available.'
  }));

  const liked = watchlistContent.slice(0, 12).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'Entertainment',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: item.type === 'movie' ? `${item.duration || 120} min` : `${item.season_count || 1} Season`,
    description: item.description || 'No description available.'
  }));

  const downloaded = watchlistContent.slice(0, 6).map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'Entertainment',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: item.type === 'movie' ? `${item.duration || 120} min` : `${item.season_count || 1} Season`,
    description: item.description || 'No description available.'
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <h1 className="text-4xl font-bold mb-8">My List</h1>
          
          <div className="space-y-8 md:space-y-12">
            {continueWatching.length > 0 && (
              <ContentCarousel
                title="Continue Watching"
                items={continueWatching}
                showProgress={true}
              />
            )}
            
            {recentlyAdded.length > 0 && (
              <ContentCarousel
                title="Recently Added"
                items={recentlyAdded}
              />
            )}
            
            {favoriteMovies.length > 0 && (
              <ContentCarousel
                title="Favorite Movies"
                items={favoriteMovies}
              />
            )}
            
            {favoriteTVShows.length > 0 && (
              <ContentCarousel
                title="Favorite TV Shows"
                items={favoriteTVShows}
              />
            )}
            
            {watchLater.length > 0 && (
              <ContentCarousel
                title="Watch Later"
                items={watchLater}
              />
            )}
            
            {liked.length > 0 && (
              <ContentCarousel
                title="Liked"
                items={liked}
              />
            )}
            
            {downloaded.length > 0 && (
              <ContentCarousel
                title="Downloaded"
                items={downloaded}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyList;
