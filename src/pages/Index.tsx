
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ContentCarousel } from '../components/ContentCarousel';
import { Footer } from '../components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const Index = () => {
  const { data: featuredContent = [], isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: recentContent = [], isLoading: recentLoading } = useQuery({
    queryKey: ['recent-content'],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: popularContent = [], isLoading: popularLoading } = useQuery({
    queryKey: ['popular-content'],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  // Convert content to ContentItem format
  const mapContentToItems = (content: Content[]) => {
    return content.map(item => ({
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
      genre: item.genre?.[0] || 'Entertainment',
      year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
      rating: item.age_rating || 'PG-13',
      duration: item.type === 'movie' ? `${item.duration || 120} min` : `${item.season_count || 1} Season${(item.season_count || 1) !== 1 ? 's' : ''}`,
      progress: Math.floor(Math.random() * 60) + 10, // Mock progress data
      description: item.description || 'No description available.'
    }));
  };

  const featuredItems = mapContentToItems(featuredContent);
  const recentItems = mapContentToItems(recentContent);
  const popularItems = mapContentToItems(popularContent);

  if (featuredLoading || recentLoading || popularLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection />
        
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8 space-y-12">
          {featuredItems.length > 0 && (
            <ContentCarousel
              title="Featured Content"
              items={featuredItems}
            />
          )}
          
          {recentItems.length > 0 && (
            <ContentCarousel
              title="Recently Added"
              items={recentItems}
            />
          )}
          
          {popularItems.length > 0 && (
            <ContentCarousel
              title="Popular Now"
              items={popularItems}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
