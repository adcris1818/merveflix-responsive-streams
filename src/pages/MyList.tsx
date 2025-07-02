
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentCarousel } from '../components/ContentCarousel';
import { ContentGrid } from '../components/ContentGrid';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];
type WatchHistory = Database['public']['Tables']['watch_history']['Row'];
type Watchlist = Database['public']['Tables']['user_watchlist']['Row'];

const MyList = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Continue watching (from watch history)
  const { data: continueWatching = [], isLoading: continueLoading } = useQuery({
    queryKey: ['continue-watching'],
    queryFn: async (): Promise<(WatchHistory & { content: Content })[]> => {
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
      return (data || []).filter(item => item.content) as (WatchHistory & { content: Content })[];
    },
  });

  // Watchlist
  const { data: watchlist = [], isLoading: watchlistLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async (): Promise<(Watchlist & { content: Content })[]> => {
      const { data, error } = await supabase
        .from('user_watchlist')
        .select(`
          *,
          content:content_id (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).filter(item => item.content) as (Watchlist & { content: Content })[];
    },
  });

  // Recently watched
  const { data: recentlyWatched = [], isLoading: recentLoading } = useQuery({
    queryKey: ['recently-watched'],
    queryFn: async (): Promise<(WatchHistory & { content: Content })[]> => {
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          content:content_id (*)
        `)
        .order('watched_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []).filter(item => item.content) as (WatchHistory & { content: Content })[];
    },
  });

  const mapToContentItems = (items: (WatchHistory & { content: Content })[] | (Watchlist & { content: Content })[], showProgress = false) => {
    return items.map(item => ({
      id: item.content.id,
      title: item.content.title,
      thumbnail: item.content.thumbnail_url || item.content.poster_url || '/placeholder.svg',
      genre: item.content.genre?.[0] || 'Entertainment',
      year: item.content.release_date ? new Date(item.content.release_date).getFullYear() : new Date().getFullYear(),
      rating: item.content.age_rating || 'PG-13',
      duration: item.content.type === 'movie' ? `${item.content.duration || 120} min` : `${item.content.season_count || 1} Season${(item.content.season_count || 1) !== 1 ? 's' : ''}`,
      progress: showProgress && 'progress_percentage' in item ? item.progress_percentage || 0 : 0,
      description: item.content.description || 'No description available.'
    }));
  };

  const continueWatchingItems = mapToContentItems(continueWatching, true);
  const watchlistItems = mapToContentItems(watchlist);
  const recentlyWatchedItems = mapToContentItems(recentlyWatched);

  const handleRemoveFromList = async (contentId: string, listType: 'watchlist' | 'history') => {
    try {
      if (listType === 'watchlist') {
        await supabase
          .from('user_watchlist')
          .delete()
          .eq('content_id', contentId);
      } else {
        await supabase
          .from('watch_history')
          .delete()
          .eq('content_id', contentId);
      }
    } catch (error) {
      console.error('Error removing from list:', error);
    }
  };

  if (continueLoading || watchlistLoading || recentLoading) {
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My List</h1>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>

          <Tabs defaultValue="continue" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="continue">Continue Watching</TabsTrigger>
              <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
              <TabsTrigger value="recent">Recently Watched</TabsTrigger>
            </TabsList>

            <TabsContent value="continue">
              {continueWatchingItems.length > 0 ? (
                <ContentCarousel
                  title="Continue Watching"
                  items={continueWatchingItems}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No content to continue watching</p>
                  <p className="text-gray-500 mt-2">Start watching something to see it here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="watchlist">
              {watchlistItems.length > 0 ? (
                viewMode === 'grid' ? (
                  <ContentGrid items={watchlistItems} />
                ) : (
                  <div className="space-y-4">
                    {watchlistItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{item.genre} • {item.year} • {item.duration}</p>
                          <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveFromList(item.id, 'watchlist')}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">Your watchlist is empty</p>
                  <p className="text-gray-500 mt-2">Add movies and shows to watch them later</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent">
              {recentlyWatchedItems.length > 0 ? (
                viewMode === 'grid' ? (
                  <ContentGrid items={recentlyWatchedItems} />
                ) : (
                  <div className="space-y-4">
                    {recentlyWatchedItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                        <img src={item.thumbnail} alt={item.title} className="w-16 h-24 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-gray-400 text-sm">{item.genre} • {item.year} • {item.duration}</p>
                          <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveFromList(item.id, 'history')}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No recently watched content</p>
                  <p className="text-gray-500 mt-2">Your viewing history will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyList;
