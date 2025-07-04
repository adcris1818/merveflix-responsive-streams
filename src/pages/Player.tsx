
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
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

  const { data: relatedContent = [] } = useQuery({
    queryKey: ['related-content', content?.genre?.[0]],
    queryFn: async () => {
      if (!content?.genre?.[0]) return [];
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .contains('genre', [content.genre[0]])
        .neq('id', content.id)
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    enabled: !!content?.genre?.[0],
  });

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    console.log('Watch progress:', { currentTime, duration, progress: (currentTime / duration) * 100 });
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = content?.title || 'Check out this content';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const episodeList = content?.type === 'tv_show' ? [
    { id: 1, title: 'Episode 1', duration: '45:30', thumbnail: content.thumbnail_url },
    { id: 2, title: 'Episode 2', duration: '46:15', thumbnail: content.thumbnail_url },
    { id: 3, title: 'Episode 3', duration: '44:20', thumbnail: content.thumbnail_url },
  ] : [];

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
      // Handle embed code - show in main player area
      return (
        <div className="min-h-screen bg-black flex">
          <div className="flex-1">
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
          
          {/* Right Sidebar */}
          <div className="w-80 bg-gray-900 overflow-y-auto">
            <div className="p-4">
              <h1 className="text-xl font-bold text-white mb-2">{content.title}</h1>
              <p className="text-gray-300 text-sm mb-4">{content.description}</p>
              
              {/* Sharing Icons */}
              <div className="flex space-x-2 mb-6">
                <Button size="sm" variant="ghost" onClick={() => handleShare('facebook')} className="text-white hover:bg-white/20">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')} className="text-white hover:bg-white/20">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleShare('copy')} className="text-white hover:bg-white/20">
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="related" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="related" className="text-white data-[state=active]:bg-red-600">Related</TabsTrigger>
                  <TabsTrigger value="episodes" className="text-white data-[state=active]:bg-red-600">Episodes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="related" className="space-y-3 mt-4">
                  {relatedContent.map((item) => (
                    <Card key={item.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => navigate(`/player/${item.id}`)}>
                      <CardContent className="p-3 flex space-x-3">
                        <img src={item.thumbnail_url || '/placeholder.svg'} alt={item.title} className="w-20 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm line-clamp-2">{item.title}</h3>
                          <p className="text-gray-400 text-xs">{item.duration ? `${item.duration} min` : 'Movie'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="episodes" className="space-y-3 mt-4">
                  {episodeList.map((episode) => (
                    <Card key={episode.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                      <CardContent className="p-3 flex space-x-3">
                        <img src={episode.thumbnail || '/placeholder.svg'} alt={episode.title} className="w-20 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-sm">{episode.title}</h3>
                          <p className="text-gray-400 text-xs">{episode.duration}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>

              {/* Additional Info */}
              <div className="mt-6 space-y-4">
                {content.cast_list && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Cast</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.cast_list.slice(0, 6).map((actor, index) => (
                        <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{actor}</span>
                      ))}
                    </div>
                  </div>
                )}

                {content.genre && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Genre</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.genre.map((g, index) => (
                        <span key={index} className="bg-red-600 text-white px-2 py-1 rounded text-xs">{g}</span>
                      ))}
                    </div>
                  </div>
                )}

                {content.available_subtitles_languages && (
                  <div>
                    <h3 className="text-white font-semibold mb-2">Subtitles</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.available_subtitles_languages.map((lang, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{lang}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
    <div className="min-h-screen bg-black flex">
      {/* Main Video Player Area */}
      <div className="flex-1">
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

      {/* Right Sidebar */}
      <div className="w-80 bg-gray-900 overflow-y-auto">
        <div className="p-4">
          <h1 className="text-xl font-bold text-white mb-2">{content.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-3">
            {content.age_rating && <span className="bg-gray-700 px-2 py-1 rounded">{content.age_rating}</span>}
            {content.release_date && <span>{new Date(content.release_date).getFullYear()}</span>}
            {content.duration && <span>{content.duration} min</span>}
          </div>
          <p className="text-gray-300 text-sm mb-4">{content.description}</p>
          
          {/* Sharing Icons */}
          <div className="flex space-x-2 mb-6">
            <Button size="sm" variant="ghost" onClick={() => handleShare('facebook')} className="text-white hover:bg-white/20">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')} className="text-white hover:bg-white/20">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleShare('copy')} className="text-white hover:bg-white/20">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="related" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="related" className="text-white data-[state=active]:bg-red-600">Related</TabsTrigger>
              <TabsTrigger value="episodes" className="text-white data-[state=active]:bg-red-600">Episodes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="related" className="space-y-3 mt-4">
              {relatedContent.map((item) => (
                <Card key={item.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => navigate(`/player/${item.id}`)}>
                  <CardContent className="p-3 flex space-x-3">
                    <img src={item.thumbnail_url || '/placeholder.svg'} alt={item.title} className="w-20 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-gray-400 text-xs">{item.duration ? `${item.duration} min` : 'Movie'}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="episodes" className="space-y-3 mt-4">
              {episodeList.length > 0 ? episodeList.map((episode) => (
                <Card key={episode.id} className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors">
                  <CardContent className="p-3 flex space-x-3">
                    <img src={episode.thumbnail || '/placeholder.svg'} alt={episode.title} className="w-20 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{episode.title}</h3>
                      <p className="text-gray-400 text-xs">{episode.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  <p>No episodes available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Additional Info */}
          <div className="mt-6 space-y-4">
            {content.cast_list && (
              <div>
                <h3 className="text-white font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {content.cast_list.slice(0, 6).map((actor, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{actor}</span>
                  ))}
                </div>
              </div>
            )}

            {content.genre && (
              <div>
                <h3 className="text-white font-semibold mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {content.genre.map((g, index) => (
                    <span key={index} className="bg-red-600 text-white px-2 py-1 rounded text-xs">{g}</span>
                  ))}
                </div>
              </div>
            )}

            {content.available_subtitles_languages && (
              <div>
                <h3 className="text-white font-semibold mb-2">Subtitles</h3>
                <div className="flex flex-wrap gap-2">
                  {content.available_subtitles_languages.map((lang, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
