
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  PlayCircle,
  Star,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const AdminContentManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const contentItems = [
    {
      id: 1,
      title: 'The Crown',
      type: 'Series',
      genre: 'Drama',
      rating: 8.7,
      views: '2.3M',
      duration: '4 Seasons',
      status: 'Published',
      uploadDate: '2024-01-15',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Breaking Bad',
      type: 'Series',
      genre: 'Crime',
      rating: 9.5,
      views: '3.8M',
      duration: '5 Seasons',
      status: 'Published',
      uploadDate: '2024-01-10',
      thumbnail: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Inception',
      type: 'Movie',
      genre: 'Sci-Fi',
      rating: 8.8,
      views: '1.5M',
      duration: '148 min',
      status: 'Draft',
      uploadDate: '2024-01-12',
      thumbnail: '/placeholder.svg'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Content', count: contentItems.length },
    { id: 'movies', label: 'Movies', count: contentItems.filter(item => item.type === 'Movie').length },
    { id: 'series', label: 'Series', count: contentItems.filter(item => item.type === 'Series').length },
    { id: 'published', label: 'Published', count: contentItems.filter(item => item.status === 'Published').length },
    { id: 'draft', label: 'Draft', count: contentItems.filter(item => item.status === 'Draft').length }
  ];

  const stats = [
    { title: 'Total Content', value: '1,234', icon: PlayCircle, change: '+12' },
    { title: 'Published', value: '1,156', icon: Eye, change: '+8' },
    { title: 'Draft', value: '78', icon: Edit, change: '+4' },
    { title: 'This Month', value: '45', icon: Calendar, change: '+15' }
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'movies' && item.type === 'Movie') ||
      (activeFilter === 'series' && item.type === 'Series') ||
      (activeFilter === 'published' && item.status === 'Published') ||
      (activeFilter === 'draft' && item.status === 'Draft');
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Manager</h1>
              <p className="text-gray-600">Manage your movies, series, and documentaries</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-green-600">+{stat.change} this week</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {filterOptions.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={activeFilter === filter.id ? "default" : "outline"}
                      onClick={() => setActiveFilter(filter.id)}
                      className="whitespace-nowrap"
                    >
                      {filter.label} ({filter.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-600">Content</th>
                          <th className="text-left p-4 font-medium text-gray-600">Type</th>
                          <th className="text-left p-4 font-medium text-gray-600">Genre</th>
                          <th className="text-left p-4 font-medium text-gray-600">Rating</th>
                          <th className="text-left p-4 font-medium text-gray-600">Views</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContent.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-16 h-10 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{item.title}</p>
                                  <p className="text-sm text-gray-500">{item.duration}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700">{item.type}</td>
                            <td className="p-4 text-gray-700">{item.genre}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-gray-700">{item.rating}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-700">{item.views}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.status === 'Published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload video files</h3>
                    <p className="text-gray-600 mb-4">Drag and drop your video files here, or click to browse</p>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Choose Files
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Input placeholder="Enter content title" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                        <option>Movie</option>
                        <option>Series</option>
                        <option>Documentary</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={4}
                      placeholder="Enter content description"
                    />
                  </div>
                  
                  <Button className="bg-red-600 hover:bg-red-700">
                    Upload Content
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Most Watched</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contentItems.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                          <img src={item.thumbnail} alt={item.title} className="w-12 h-8 object-cover rounded" />
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Genres</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Drama</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Crime</span>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sci-Fi</span>
                        <span className="text-sm font-medium">23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div className="border-l-2 border-red-600 pl-3">
                        <p className="font-medium">New upload</p>
                        <p className="text-gray-600">Inception was published</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="border-l-2 border-blue-600 pl-3">
                        <p className="font-medium">Content updated</p>
                        <p className="text-gray-600">The Crown metadata updated</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                      <div className="border-l-2 border-green-600 pl-3">
                        <p className="font-medium">Milestone reached</p>
                        <p className="text-gray-600">Breaking Bad hit 1M views</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminContentManager;
