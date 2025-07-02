
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
import { Upload, Link, Code, Save, X } from 'lucide-react';
import { useContentManagement } from '../../hooks/useContentManagement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ContentUpload = () => {
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
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
    content_tags: [] as string[]
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

  const handleFileUpload = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL using the correct method
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
        thumbnail_url: posterUrl, // Use poster as thumbnail for now
        is_featured: formData.is_featured,
        content_tags: formData.content_tags,
        is_active: true
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
        content_tags: []
      });
      setSelectedFile(null);
      setPosterFile(null);
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
