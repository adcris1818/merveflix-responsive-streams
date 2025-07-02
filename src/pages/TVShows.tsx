
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ContentGrid } from '../components/ContentGrid';
import { FilterTabs } from '../components/FilterTabs';
import { Footer } from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const TVShows = () => {
  const [activeFilter, setActiveFilter] = useState('All Genres');

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['tv-shows'],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'tv_show')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const filters = ['All Genres', 'Drama', 'Comedy', 'Action', 'Sci-Fi', 'Crime', 'Documentary', 'Reality'];

  const filteredContent = activeFilter === 'All Genres' 
    ? content 
    : content.filter(item => item.genre?.includes(activeFilter));

  const contentItems = filteredContent.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || 'TV Show',
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: `${item.season_count || 1} Season${(item.season_count || 1) !== 1 ? 's' : ''}`,
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
          <h1 className="text-4xl font-bold mb-8">TV Shows</h1>
          
          <FilterTabs
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          
          <ContentGrid items={contentItems} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TVShows;
