
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Upload, Link, Code, Save, X, Search, Star } from 'lucide-react';
import { useContentManagement } from '../../hooks/useContentManagement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ContentUpload = () => {
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [tmdbSearchTerm, setTmdbSearchTerm] = useState('');
  const [tmdbResults, setTmdbResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie' as 'movie' | 'tv_show' | 'documentary',
    genre: [] as string[],
    age_rating: '',
    language: 'en',
    release_date: '',
    duration: '',
    season_count: '',
    episode_count: '',
    external_url: '',
    embed_code: '',
    video_source: 'local' as 'local' | 'external' | 'embed',
    is_featured: false,
    is_active: true,
    status: 'pending' as 'pending' | 'approved' | 'rejected',
    content_tags: [] as string[],
    cast_list: [] as string[],
    tmdb_id: ''
  });

  const { createContent } = useContentManagement();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenreChange = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre) 
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleCastChange = (cast: string) => {
    const castArray = cast.split(',').map(c => c.trim()).filter(c => c.length > 0);
    setFormData(prev => ({ ...prev, cast_list: castArray }));
  };

  const handleTagsChange = (tags: string) => {
    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    setFormData(prev => ({ ...prev, content_tags: tagsArray }));
  };

  // TMDb search functionality
  const searchTMDb = async () => {
    if (!tmdbSearchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      // In a real implementation, you would make an API call to TMDb
      // For now, we'll simulate the search results
      const mockResults = [
        {
          id: 550,
          title: tmdbSearchTerm,
          overview: "Sample movie description from TMDb",
          release_date: "2023-01-01",
          genre_ids: [18, 53],
          poster_path: "/sample.jpg",
          vote_average: 8.5,
          runtime: 139
        }
      ];
      
      setTmdbResults(mockResults);
      toast.success(`Found ${mockResults.length} results`);
    } catch (error) {
      console.error('TMDb search error:', error);
      toast.error('Failed to search TMDb');
    } finally {
      setIsSearching(false);
    }
  };

  const selectTMDbMovie = (movie: any) => {
    setFormData(prev => ({
      ...prev,
      title: movie.title,
      description: movie.overview,
      release_date: movie.release_date,
      duration: movie.runtime?.toString() || '',
      tmdb_id: movie.id.toString(),
      // Map TMDb genres to our genre system
      genre: movie.genre_ids?.map((id: number) => {
        const genreMap: { [key: number]: string } = {
          28: 'Action', 35: 'Comedy', 18: 'Drama', 27: 'Horror',
          878: 'Sci-Fi', 10749: 'Romance', 53: 'Thriller', 99: 'Documentary'
        };
        return genreMap[id] || 'Drama';
      }) || []
    }));
    
    // If poster path exists, set it as external URL for poster
    if (movie.poster_path) {
      // In real implementation, you'd use TMDb image base URL
      // setPosterUrl(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
    }
    
    toast.success('Movie data imported from TMDb');
  };

  const handleFileUpload = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('content-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let videoUrl = null;
      let posterUrl = null;

      // Handle video upload based on source type
      if (formData.video_source === 'local' && selectedFile) {
        videoUrl = await handleFileUpload(selectedFile, 'videos');
      } else if (formData.video_source === 'external') {
        videoUrl = formData.external_url;
      } else if (formData.video_source === 'embed') {
        videoUrl = formData.embed_code;
      }

      // Handle poster upload
      if (posterFile) {
        posterUrl = await handleFileUpload(posterFile, 'posters');
      }

      // Prepare content data
      const contentData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        genre: formData.genre,
        age_rating: formData.age_rating || null,
        language: formData.language,
        release_date: formData.release_date || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        season_count: formData.season_count ? parseInt(formData.season_count) : null,
        episode_count: formData.episode_count ? parseInt(formData.episode_count) : null,
        video_url: videoUrl,
        poster_url: posterUrl,
        thumbnail_url: posterUrl,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        status: formData.status,
        content_tags: formData.content_tags,
        cast_list: formData.cast_list
      };

      await createContent.mutateAsync(contentData);
      toast.success('Content uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'movie',
        genre: [],
        age_rating: '',
        language: 'en',
        release_date: '',
        duration: '',
        season_count: '',
        episode_count: '',
        external_url: '',
        embed_code: '',
        video_source: 'local',
        is_featured: false,
        is_active: true,
        status: 'pending',
        content_tags: [],
        cast_list: [],
        tmdb_id: ''
      });
      setSelectedFile(null);
      setPosterFile(null);
      setTmdbResults([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload content');
    } finally {
      setIsUploading(false);
    }
  };

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Adventure'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
            <p className="text-gray-600">Add new movies, TV shows, and documentaries to your platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* TMDb Search */}
                <Card>
                  <CardHeader>
                    <CardTitle>Import from TMDb</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search movies/TV shows on TMDb..."
                        value={tmdbSearchTerm}
                        onChange={(e) => setTmdbSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), searchTMDb())}
                      />
                      <Button 
                        type="button" 
                        onClick={searchTMDb}
                        disabled={isSearching}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {tmdbResults.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {tmdbResults.map((movie) => (
                          <div
                            key={movie.id}
                            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => selectTMDbMovie(movie)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{movie.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{movie.overview}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">{movie.release_date}</span>
                                  {movie.vote_average && (
                                    <div className="flex items-center text-xs text-yellow-600">
                                      <Star className="h-3 w-3 mr-1" />
                                      {movie.vote_average.toFixed(1)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter content title"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter content description"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Content Type *</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value) => handleInputChange('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="movie">Movie</SelectItem>
                            <SelectItem value="tv_show">TV Show</SelectItem>
                            <SelectItem value="documentary">Documentary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select 
                          value={formData.language} 
                          onValueChange={(value) => handleInputChange('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cast">Cast (comma separated)</Label>
                      <Input
                        id="cast"
                        value={formData.cast_list.join(', ')}
                        onChange={(e) => handleCastChange(e.target.value)}
                        placeholder="Actor 1, Actor 2, Actor 3..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.content_tags.join(', ')}
                        onChange={(e) => handleTagsChange(e.target.value)}
                        placeholder="action, thriller, blockbuster..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Video Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Video Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={formData.video_source} onValueChange={(value) => handleInputChange('video_source', value)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="local">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload File
                        </TabsTrigger>
                        <TabsTrigger value="external">
                          <Link className="h-4 w-4 mr-2" />
                          External URL
                        </TabsTrigger>
                        <TabsTrigger value="embed">
                          <Code className="h-4 w-4 mr-2" />
                          Embed Code
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="local" className="space-y-4">
                        <div>
                          <Label htmlFor="video-file">Video File</Label>
                          <Input
                            id="video-file"
                            type="file"
                            accept="video/*"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                          {selectedFile && (
                            <p className="text-sm text-gray-600 mt-1">
                              Selected: {selectedFile.name}
                            </p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="external" className="space-y-4">
                        <div>
                          <Label htmlFor="external-url">Video URL</Label>
                          <Input
                            id="external-url"
                            value={formData.external_url}
                            onChange={(e) => handleInputChange('external_url', e.target.value)}
                            placeholder="https://example.com/video.mp4 or Bunny.net URL"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Supports direct video URLs, Bunny.net, and other CDN links
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="embed" className="space-y-4">
                        <div>
                          <Label htmlFor="embed-code">Embed Code</Label>
                          <Textarea
                            id="embed-code"
                            value={formData.embed_code}
                            onChange={(e) => handleInputChange('embed_code', e.target.value)}
                            placeholder="<iframe src='...' or embed code from YouTube, Vimeo, etc."
                            rows={4}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Paste embed code from YouTube, Vimeo, Bunny.net, or other video platforms
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Metadata */}
              <div className="space-y-6">
                {/* Poster Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Poster Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="poster-file">Poster Image</Label>
                      <Input
                        id="poster-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                      />
                      {posterFile && (
                        <p className="text-sm text-gray-600 mt-1">
                          Selected: {posterFile.name}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="status">Approval Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-active"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="is-active">Active Content</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-featured"
                        checked={formData.is_featured}
                        onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="is-featured">Featured Content</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Genres</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {genres.map(genre => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => handleGenreChange(genre)}
                            className={`px-3 py-1 text-xs rounded-full border ${
                              formData.genre.includes(genre)
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border-gray-300'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="age-rating">Age Rating</Label>
                      <Select 
                        value={formData.age_rating} 
                        onValueChange={(value) => handleInputChange('age_rating', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="G">G</SelectItem>
                          <SelectItem value="PG">PG</SelectItem>
                          <SelectItem value="PG-13">PG-13</SelectItem>
                          <SelectItem value="R">R</SelectItem>
                          <SelectItem value="NC-17">NC-17</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="release-date">Release Date</Label>
                      <Input
                        id="release-date"
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => handleInputChange('release_date', e.target.value)}
                      />
                    </div>

                    {formData.type === 'movie' && (
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          placeholder="120"
                        />
                      </div>
                    )}

                    {formData.type === 'tv_show' && (
                      <>
                        <div>
                          <Label htmlFor="season-count">Season Count</Label>
                          <Input
                            id="season-count"
                            type="number"
                            value={formData.season_count}
                            onChange={(e) => handleInputChange('season_count', e.target.value)}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="episode-count">Episode Count</Label>
                          <Input
                            id="episode-count"
                            type="number"
                            value={formData.episode_count}
                            onChange={(e) => handleInputChange('episode_count', e.target.value)}
                            placeholder="10"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUploading || !formData.title}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Upload Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentUpload;
