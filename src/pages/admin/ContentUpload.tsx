
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Upload, Link, Code, Video, Image, Plus, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['movie', 'tv_show', 'documentary', 'series']),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  release_date: z.string().optional(),
  duration: z.number().min(1).optional(),
  age_rating: z.string().optional(),
  language: z.string().default('en'),
  video_source: z.enum(['upload', 'embed', 'url']),
  video_url: z.string().optional(),
  embed_code: z.string().optional(),
  poster_file: z.any().optional(),
  video_file: z.any().optional(),
});

type ContentForm = z.infer<typeof contentSchema>;

const ContentUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');

  const form = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'movie',
      genre: [],
      language: 'en',
      video_source: 'upload',
    },
  });

  const watchVideoSource = form.watch('video_source');

  const addGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      const updatedGenres = [...genres, newGenre.trim()];
      setGenres(updatedGenres);
      form.setValue('genre', updatedGenres);
      setNewGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    const updatedGenres = genres.filter(g => g !== genreToRemove);
    setGenres(updatedGenres);
    form.setValue('genre', updatedGenres);
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;
    return data;
  };

  const onSubmit = async (data: ContentForm) => {
    setUploading(true);
    try {
      let videoUrl = data.video_url;
      let posterUrl = '';

      // Handle video upload
      if (data.video_source === 'upload' && data.video_file?.[0]) {
        const videoFile = data.video_file[0];
        const videoPath = `videos/${Date.now()}-${videoFile.name}`;
        await uploadFile(videoFile, 'content-assets', videoPath);
        videoUrl = `${supabase.supabaseUrl}/storage/v1/object/public/content-assets/${videoPath}`;
      }

      // Handle poster upload
      if (data.poster_file?.[0]) {
        const posterFile = data.poster_file[0];
        const posterPath = `posters/${Date.now()}-${posterFile.name}`;
        await uploadFile(posterFile, 'content-assets', posterPath);
        posterUrl = `${supabase.supabaseUrl}/storage/v1/object/public/content-assets/${posterPath}`;
      }

      // Create content record
      const contentData = {
        title: data.title,
        description: data.description,
        type: data.type,
        genre: data.genre,
        release_date: data.release_date || null,
        duration: data.duration || null,
        age_rating: data.age_rating,
        language: data.language,
        video_url: videoUrl,
        poster_url: posterUrl,
        is_active: true,
      };

      const { error } = await supabase
        .from('content')
        .insert([contentData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content uploaded successfully!',
      });

      form.reset();
      setGenres([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const supportedEmbedProviders = [
    { name: 'Bunny.net', example: '<iframe src="https://iframe.mediadelivery.net/embed/YOUR_LIBRARY_ID/YOUR_VIDEO_ID" ...></iframe>' },
    { name: 'YouTube', example: '<iframe src="https://www.youtube.com/embed/VIDEO_ID" ...></iframe>' },
    { name: 'Vimeo', example: '<iframe src="https://player.vimeo.com/video/VIDEO_ID" ...></iframe>' },
    { name: 'Wistia', example: '<iframe src="https://fast.wistia.net/embed/iframe/VIDEO_ID" ...></iframe>' },
    { name: 'JW Player', example: '<iframe src="https://content.jwplatform.com/players/VIDEO_ID" ...></iframe>' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
            <p className="text-gray-600">Add movies, TV shows, and documentaries to your platform</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter content title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter content description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="movie">Movie</SelectItem>
                                  <SelectItem value="tv_show">TV Show</SelectItem>
                                  <SelectItem value="documentary">Documentary</SelectItem>
                                  <SelectItem value="series">Series</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="age_rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age Rating</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="G">G</SelectItem>
                                  <SelectItem value="PG">PG</SelectItem>
                                  <SelectItem value="PG-13">PG-13</SelectItem>
                                  <SelectItem value="R">R</SelectItem>
                                  <SelectItem value="NC-17">NC-17</SelectItem>
                                  <SelectItem value="TV-Y">TV-Y</SelectItem>
                                  <SelectItem value="TV-Y7">TV-Y7</SelectItem>
                                  <SelectItem value="TV-G">TV-G</SelectItem>
                                  <SelectItem value="TV-PG">TV-PG</SelectItem>
                                  <SelectItem value="TV-14">TV-14</SelectItem>
                                  <SelectItem value="TV-MA">TV-MA</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="release_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Release Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="120" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Genre Management */}
                      <div className="space-y-3">
                        <FormLabel>Genres</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add genre"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                          />
                          <Button type="button" onClick={addGenre} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {genres.map((genre) => (
                            <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                              {genre}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeGenre(genre)}
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Video Source Selection */}
                      <FormField
                        control={form.control}
                        name="video_source"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Source</FormLabel>
                            <Tabs value={field.value} onValueChange={field.onChange}>
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="upload" className="flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  Upload
                                </TabsTrigger>
                                <TabsTrigger value="url" className="flex items-center gap-2">
                                  <Link className="h-4 w-4" />
                                  URL
                                </TabsTrigger>
                                <TabsTrigger value="embed" className="flex items-center gap-2">
                                  <Code className="h-4 w-4" />
                                  Embed
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="upload" className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="video_file"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Video File</FormLabel>
                                      <FormControl>
                                        <Input 
                                          type="file" 
                                          accept="video/*"
                                          {...form.register('video_file')}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TabsContent>

                              <TabsContent value="url" className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="video_url"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Video URL</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="https://example.com/video.mp4" 
                                          {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TabsContent>

                              <TabsContent value="embed" className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="embed_code"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Embed Code</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          placeholder="<iframe src='...'></iframe>" 
                                          {...field}
                                          rows={4}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TabsContent>
                            </Tabs>
                          </FormItem>
                        )}
                      />

                      {/* Poster Upload */}
                      <FormField
                        control={form.control}
                        name="poster_file"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Poster Image</FormLabel>
                            <FormControl>
                              <Input 
                                type="file" 
                                accept="image/*"
                                {...form.register('poster_file')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={uploading} className="w-full">
                        {uploading ? 'Uploading...' : 'Upload Content'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Supported Video Providers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportedEmbedProviders.map((provider) => (
                    <div key={provider.name} className="space-y-2">
                      <h4 className="font-medium">{provider.name}</h4>
                      <code className="block text-xs bg-gray-100 p-2 rounded text-wrap break-all">
                        {provider.example}
                      </code>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Upload Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <strong>Video Formats:</strong>
                    <p className="text-gray-600">MP4, WebM, MOV (H.264/H.265 recommended)</p>
                  </div>
                  <div>
                    <strong>Image Formats:</strong>
                    <p className="text-gray-600">JPG, PNG, WebP (1920x1080 recommended)</p>
                  </div>
                  <div>
                    <strong>File Sizes:</strong>
                    <p className="text-gray-600">Videos: Max 2GB, Images: Max 10MB</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentUpload;
