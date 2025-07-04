
import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ContentGrid } from '../components/ContentGrid';
import { Footer } from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const Index = () => {
  const { data: featuredContent } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async (): Promise<Content | null> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching featured content:', error);
        return null;
      }
      return data;
    },
  });

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['trending-content'],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(12);

      if (error) throw error;
      return data || [];
    },
  });

  const contentItems = content.map(item => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
    genre: item.genre?.[0] || (item.type === 'movie' ? 'Movie' : 'TV Show'),
    year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
    rating: item.age_rating || 'PG-13',
    duration: item.type === 'movie' 
      ? `${item.duration || 120} min` 
      : `${item.season_count || 1} Season${(item.season_count || 1) !== 1 ? 's' : ''}`,
    description: item.description || 'No description available.'
  }));

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection content={featuredContent} />
        
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-16">
          <h2 className="text-3xl font-bold mb-8">Trending Now</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <ContentGrid items={contentItems} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
