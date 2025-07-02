
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AdvancedVideoPlayer } from '../components/AdvancedVideoPlayer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: content, isLoading } = useQuery({
    queryKey: ['content', id],
    queryFn: async (): Promise<Content | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    // Track watch progress - in a real app, you'd save this to the database
    console.log('Watch progress:', { currentTime, duration, progress: (currentTime / duration) * 100 });
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
          <Button onClick={goBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Prepare video sources based on content type
  const videoSources = [];
  
  if (content.video_url) {
    if (content.video_url.includes('<iframe') || content.video_url.includes('embed')) {
      // Handle embed code
      return (
        <div className="min-h-screen bg-black">
          <div className="absolute top-4 left-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
          <div 
            className="w-full h-screen"
            dangerouslySetInnerHTML={{ __html: content.video_url }}
          />
        </div>
      );
    } else {
      // Handle direct video URLs
      const videoUrl = content.video_url;
      const fileExtension = videoUrl.split('.').pop()?.toLowerCase();
      
      let mimeType = 'video/mp4';
      if (fileExtension === 'webm') mimeType = 'video/webm';
      else if (fileExtension === 'ogg') mimeType = 'video/ogg';
      
      videoSources.push({
        src: videoUrl,
        type: mimeType,
        quality: 'HD'
      });
      
      // Add multiple quality options if available
      videoSources.push({
        src: videoUrl,
        type: mimeType,
        quality: '720p'
      });
      
      videoSources.push({
        src: videoUrl,
        type: mimeType,
        quality: '480p'
      });
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="text-white hover:bg-white/20 p-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="w-full h-screen">
        {videoSources.length > 0 ? (
          <AdvancedVideoPlayer
            sources={videoSources}
            poster={content.poster_url || content.thumbnail_url || undefined}
            title={content.title}
            onTimeUpdate={handleTimeUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Video Not Available</h2>
              <p className="text-gray-400 mb-4">
                This content doesn't have a valid video source configured.
              </p>
              <Button onClick={goBack}>Go Back</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
