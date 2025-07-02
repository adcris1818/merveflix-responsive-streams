
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ContentCarousel } from '../components/ContentCarousel';
import { Footer } from '../components/Footer';
import { useAuthContext } from '@/components/auth/AuthProvider';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const Index = () => {
  const { user, profile } = useAuthContext();

  // Fetch content from Supabase
  const { data: content = [], isLoading } = useQuery({
    queryKey: ['content'],
    queryFn: async (): Promise<Content[]> => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Track page view
  useEffect(() => {
    if (user) {
      supabase.from('analytics_events').insert({
        user_id: user.id,
        event_type: 'page_view',
        event_data: { page: 'home' }
      }).then(() => {
        console.log('Page view tracked');
      });
    }
  }, [user]);

  const featuredContent = content.find(item => item.is_featured) || content[0];

  const contentSections = [
    {
      title: "Trending Now",
      items: content.filter(item => item.view_count && item.view_count > 10000).slice(0, 12)
    },
    {
      title: "New Releases",
      items: content.slice(0, 8)
    },
    {
      title: "Popular Movies",
      items: content.filter(item => item.type === 'movie').slice(0, 15)
    },
    {
      title: "TV Shows",
      items: content.filter(item => item.type === 'tv_show').slice(0, 10)
    },
    {
      title: "Documentaries",
      items: content.filter(item => item.type === 'documentary').slice(0, 8)
    }
  ].filter(section => section.items.length > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header user={profile} />
      <main>
        {featuredContent && (
          <HeroSection content={{
            id: featuredContent.id,
            title: featuredContent.title,
            description: featuredContent.description || '',
            backgroundImage: featuredContent.poster_url || '/placeholder.svg',
            genre: featuredContent.genre?.[0] || 'Entertainment',
            year: featuredContent.release_date ? new Date(featuredContent.release_date).getFullYear() : new Date().getFullYear(),
            rating: featuredContent.age_rating || 'PG-13',
            duration: featuredContent.type === 'movie' 
              ? `${featuredContent.duration} min` 
              : `${featuredContent.season_count} Season${featuredContent.season_count !== 1 ? 's' : ''}`
          }} />
        )}
        
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 space-y-8 md:space-y-12 py-8">
          {contentSections.map((section, index) => (
            <ContentCarousel
              key={index}
              title={section.title}
              items={section.items.map(item => ({
                id: item.id,
                title: item.title,
                thumbnail: item.thumbnail_url || item.poster_url || '/placeholder.svg',
                genre: item.genre?.[0] || 'Entertainment',
                year: item.release_date ? new Date(item.release_date).getFullYear() : new Date().getFullYear(),
                rating: item.age_rating || 'PG-13',
                progress: Math.floor(Math.random() * 80) + 10 // This should come from watch_history in a real implementation
              }))}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
