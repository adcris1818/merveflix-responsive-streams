
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FileVideo, Plus, Edit, Trash2, Search, Filter, Eye, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useContentManagement } from '../../hooks/useContentManagement';
import { Link } from 'react-router-dom';

const ContentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { content, isLoading, deleteContent } = useContentManagement();

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Performing ${action} on content ${contentId}`);
    if (action === 'delete') {
      deleteContent.mutate(contentId);
    }
  };

  const filteredContent = content?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
              <p className="text-gray-600">Manage movies, TV shows, and documentaries</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/content/upload">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <FileVideo className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content?.length || 0}</div>
                <p className="text-xs text-green-600">Active content</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Movies</CardTitle>
                <FileVideo className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {content?.filter(c => c.type === 'movie').length || 0}
                </div>
                <p className="text-xs text-green-600">Movie content</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TV Shows</CardTitle>
                <FileVideo className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {content?.filter(c => c.type === 'tv_show').length || 0}
                </div>
                <p className="text-xs text-green-600">TV show content</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <FileVideo className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {content?.filter(c => c.is_featured).length || 0}
                </div>
                <p className="text-xs text-blue-600">Currently featured</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="tv_show">TV Shows</SelectItem>
                    <SelectItem value="documentary">Documentaries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Table */}
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading content...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="font-medium">{content.title}</div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{content.type.replace('_', ' ')}</span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {content.genre?.slice(0, 2).join(', ')}
                            {content.genre && content.genre.length > 2 && '...'}
                          </div>
                        </TableCell>
                        <TableCell>{content.rating ? `${content.rating}/10` : 'N/A'}</TableCell>
                        <TableCell>{content.view_count?.toLocaleString() || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              content.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {content.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {content.is_featured && (
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'edit')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'delete')}
                              disabled={deleteContent.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentManager;
