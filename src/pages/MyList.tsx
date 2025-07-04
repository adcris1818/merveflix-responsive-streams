
import React from 'react';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/ContentGrid';
import { Footer } from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type WatchHistory = Database['public']['Tables']['watch_history']['Row'];
type Watchlist = Database['public']['Tables']['user_watchlist']['Row'];
type Content = Database['public']['Tables']['content']['Row'];

interface WatchHistoryWithContent extends WatchHistory {
  content: Content;
}

interface WatchlistWithContent extends Watchlist {
  content: Content;
}

const MyList = () => {
  const { data: continueWatching = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: async (): Promise<WatchHistoryWithContent[]> => {
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          content:content_id (*)
        `)
        .eq('completed', false)
        .order('watched_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data as any[])?.filter(item => item.content && !item.content.error) || [];
    },
  });

  const { data: watchlist = [], isLoading: loadingWatchlist } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async (): Promise<WatchlistWithContent[]> => {
      const { data, error } = await supabase
        .from('user_watchlist')
        .select(`
          *,
          content:content_id (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any[])?.filter(item => item.content && !item.content.error) || [];
    },
  });

  const { data: recentlyWatched = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recently-watched'],
    queryFn: async (): Promise<WatchHistoryWithContent[]> => {
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          content:content_id (*)
        `)
        .order('watched_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data as any[])?.filter(item => item.content && !item.content.error) || [];
    },
  });

  const continueWatchingItems = continueWatching.map(item => ({
    id: item.content.id,
    title: item.content.title,
    thumbnail: item.content.thumbnail_url || item.content.poster_url || '/placeholder.svg',
    genre: item.content.genre?.[0] || (item.content.type === 'movie' ? 'Movie' : 'TV Show'),
    year: item.content.release_date ? new Date(item.content.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.content.age_rating || 'PG-13',
    duration: item.content.type === 'movie' 
      ? `${item.content.duration || 120} min` 
      : `${item.content.season_count || 1} Season${(item.content.season_count || 1) !== 1 ? 's' : ''}`,
    description: item.content.description || 'No description available.',
    progress: Math.round(Number(item.progress_percentage) || 0)
  }));

  const watchlistItems = watchlist.map(item => ({
    id: item.content.id,
    title: item.content.title,
    thumbnail: item.content.thumbnail_url || item.content.poster_url || '/placeholder.svg',
    genre: item.content.genre?.[0] || (item.content.type === 'movie' ? 'Movie' : 'TV Show'),
    year: item.content.release_date ? new Date(item.content.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.content.age_rating || 'PG-13',
    duration: item.content.type === 'movie' 
      ? `${item.content.duration || 120} min` 
      : `${item.content.season_count || 1} Season${(item.content.season_count || 1) !== 1 ? 's' : ''}`,
    description: item.content.description || 'No description available.'
  }));

  const recentItems = recentlyWatched.map(item => ({
    id: item.content.id,
    title: item.content.title,
    thumbnail: item.content.thumbnail_url || item.content.poster_url || '/placeholder.svg',
    genre: item.content.genre?.[0] || (item.content.type === 'movie' ? 'Movie' : 'TV Show'),
    year: item.content.release_date ? new Date(item.content.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.content.age_rating || 'PG-13',
    duration: item.content.type === 'movie' 
      ? `${item.content.duration || 120} min` 
      : `${item.content.season_count || 1} Season${(item.content.season_count || 1) !== 1 ? 's' : ''}`,
    description: item.content.description || 'No description available.'
  }));

  const isLoading = loadingHistory || loadingWatchlist || loadingRecent;

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
          
          {continueWatchingItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Continue Watching</h2>
              <ContentGrid items={continueWatchingItems} showProgress />
            </div>
          )}

          {watchlistItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">My Watchlist</h2>
              <ContentGrid items={watchlistItems} />
            </div>
          )}

          {recentItems.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Recently Watched</h2>
              <ContentGrid items={recentItems} />
            </div>
          )}

          {continueWatchingItems.length === 0 && watchlistItems.length === 0 && recentItems.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Your list is empty</h2>
              <p className="text-gray-400 mb-8">Start watching content to build your personal collection</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyList;
