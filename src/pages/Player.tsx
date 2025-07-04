
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon, Download, Heart, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AdvancedVideoPlayer } from '../components/AdvancedVideoPlayer';
import { Header } from '../components/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Content = Database['public']['Tables']['content']['Row'];

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

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
        .eq('is_active', true)
        .eq('status', 'approved')
        .limit(12);

      if (error) throw error;
      return data || [];
    },
    enabled: !!content?.genre?.[0],
  });

  const { data: episodes = [] } = useQuery({
    queryKey: ['episodes', content?.id],
    queryFn: async () => {
      if (content?.type !== 'tv_show') return [];
      
      // Generate mock episodes based on episode_count
      return Array.from({ length: content.episode_count || 8 }, (_, i) => ({
        id: `${content.id}-ep-${i + 1}`,
        title: `Episode ${i + 1}`,
        description: `Episode ${i + 1} description`,
        duration: '42:30',
        thumbnail: content.thumbnail_url,
        episode_number: i + 1,
        season_number: 1
      }));
    },
    enabled: !!content && content.type === 'tv_show',
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

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
            <Button onClick={goBack}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle embed code content
  if (content.video_url && (content.video_url.includes('<iframe') || content.video_url.includes('embed'))) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-16 flex">
          <div className="flex-1">
            <div className="absolute top-20 left-4 z-50">
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
              className="w-full aspect-video"
              dangerouslySetInnerHTML={{ __html: content.video_url }}
            />
            
            {/* Content Info Below Player */}
            <div className="p-6 bg-black text-white">
              {/* Share Icons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLike}
                    className={`text-white hover:bg-white/20 ${isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleWatchlist}
                    className="text-white hover:bg-white/20"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isInWatchlist ? 'Remove from' : 'Add to'} Watchlist
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('facebook')} 
                    className="text-white hover:bg-white/20"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('twitter')} 
                    className="text-white hover:bg-white/20"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('copy')} 
                    className="text-white hover:bg-white/20"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {content.age_rating && (
                    <Badge variant="outline" className="text-white border-white">
                      {content.age_rating}
                    </Badge>
                  )}
                  {content.release_date && (
                    <span className="text-gray-300">
                      {new Date(content.release_date).getFullYear()}
                    </span>
                  )}
                  {content.duration && (
                    <span className="text-gray-300">{content.duration} min</span>
                  )}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {content.description}
                </p>
              </div>

              {/* Cast */}
              {content.cast_list && content.cast_list.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.cast_list.slice(0, 10).map((actor, index) => (
                      <Badge key={index} variant="outline" className="text-white border-gray-600">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres */}
              {content.genre && content.genre.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.genre.map((genre, index) => (
                      <Badge key={index} className="bg-red-600 text-white">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtitles */}
              {content.available_subtitles_languages && content.available_subtitles_languages.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Available Subtitles</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.available_subtitles_languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-white border-gray-600">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="w-80 bg-gray-900 overflow-y-auto h-screen">
            <div className="p-4">
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
                  {episodes.length > 0 ? episodes.map((episode) => (
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare video sources for regular content
  const videoSources = [];
  if (content.video_url) {
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
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-16">
        {/* Main Content Area */}
        <div className="flex">
          {/* Video Player and Info */}
          <div className="flex-1">
            {/* Back Button */}
            <div className="absolute top-20 left-4 z-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </div>

            {/* Video Player */}
            <div className="relative">
              {videoSources.length > 0 ? (
                <AdvancedVideoPlayer
                  sources={videoSources}
                  poster={content.poster_url || content.thumbnail_url || undefined}
                  title={content.title}
                  onTimeUpdate={handleTimeUpdate}
                />
              ) : (
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Video Not Available</h2>
                    <p className="text-gray-400">
                      This content doesn't have a valid video source configured.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Info Below Player */}
            <div className="p-6 bg-black text-white">
              {/* Share Icons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLike}
                    className={`text-white hover:bg-white/20 ${isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleWatchlist}
                    className="text-white hover:bg-white/20"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isInWatchlist ? 'Remove from' : 'Add to'} Watchlist
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('facebook')} 
                    className="text-white hover:bg-white/20"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('twitter')} 
                    className="text-white hover:bg-white/20"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShare('copy')} 
                    className="text-white hover:bg-white/20"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  {content.age_rating && (
                    <Badge variant="outline" className="text-white border-white">
                      {content.age_rating}
                    </Badge>
                  )}
                  {content.release_date && (
                    <span className="text-gray-300">
                      {new Date(content.release_date).getFullYear()}
                    </span>
                  )}
                  {content.duration && (
                    <span className="text-gray-300">{content.duration} min</span>
                  )}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {content.description}
                </p>
              </div>

              {/* Cast */}
              {content.cast_list && content.cast_list.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.cast_list.slice(0, 10).map((actor, index) => (
                      <Badge key={index} variant="outline" className="text-white border-gray-600">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres */}
              {content.genre && content.genre.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.genre.map((genre, index) => (
                      <Badge key={index} className="bg-red-600 text-white">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtitles */}
              {content.available_subtitles_languages && content.available_subtitles_languages.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Available Subtitles</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.available_subtitles_languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-white border-gray-600">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-gray-900 h-screen overflow-y-auto">
            <div className="p-4">
              <Tabs defaultValue="related" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="related" className="text-white data-[state=active]:bg-red-600">
                    Related
                  </TabsTrigger>
                  <TabsTrigger value="episodes" className="text-white data-[state=active]:bg-red-600">
                    Episodes
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="related" className="space-y-3 mt-4">
                  {relatedContent.length > 0 ? (
                    relatedContent.map((item) => (
                      <Card 
                        key={item.id} 
                        className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors" 
                        onClick={() => navigate(`/player/${item.id}`)}
                      >
                        <CardContent className="p-3 flex space-x-3">
                          <img 
                            src={item.thumbnail_url || '/placeholder.svg'} 
                            alt={item.title} 
                            className="w-24 h-16 object-cover rounded flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-1">
                              {item.duration ? `${item.duration} min` : 'Movie'}
                            </p>
                            <div className="flex items-center space-x-1">
                              {item.genre?.slice(0, 2).map((genre, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <p>No related content found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="episodes" className="space-y-3 mt-4">
                  {episodes.length > 0 ? (
                    episodes.map((episode) => (
                      <Card 
                        key={episode.id} 
                        className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <CardContent className="p-3 flex space-x-3">
                          <img 
                            src={episode.thumbnail || '/placeholder.svg'} 
                            alt={episode.title} 
                            className="w-24 h-16 object-cover rounded flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium text-sm mb-1">
                              {episode.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-1">{episode.duration}</p>
                            <p className="text-gray-500 text-xs line-clamp-2">
                              {episode.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <p>No episodes available</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
