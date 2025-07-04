
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FileVideo, Plus, Edit, Trash2, Search, Filter, Eye, Upload, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { useContentManagement } from '../../hooks/useContentManagement';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ContentManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { content, isLoading, deleteContent } = useContentManagement();
  const queryClient = useQueryClient();

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      toast.success('Content updated successfully');
      setShowEditDialog(false);
    },
    onError: (error) => {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  });

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Performing ${action} on content ${contentId}`);
    
    switch (action) {
      case 'delete':
        deleteContent.mutate(contentId);
        break;
      case 'approve':
        updateContentMutation.mutate({ 
          id: contentId, 
          updates: { status: 'approved', is_active: true } 
        });
        break;
      case 'reject':
        updateContentMutation.mutate({ 
          id: contentId, 
          updates: { status: 'rejected', is_active: false } 
        });
        break;
      case 'feature':
        const item = content?.find(c => c.id === contentId);
        updateContentMutation.mutate({ 
          id: contentId, 
          updates: { is_featured: !item?.is_featured } 
        });
        break;
      case 'toggle_active':
        const activeItem = content?.find(c => c.id === contentId);
        updateContentMutation.mutate({ 
          id: contentId, 
          updates: { is_active: !activeItem?.is_active } 
        });
        break;
      case 'edit':
        const editItem = content?.find(c => c.id === contentId);
        setSelectedContent(editItem);
        setShowEditDialog(true);
        break;
      case 'view':
        window.open(`/player/${contentId}`, '_blank');
        break;
    }
  };

  const handleQuickEdit = (field: string, value: any) => {
    if (!selectedContent) return;
    
    updateContentMutation.mutate({
      id: selectedContent.id,
      updates: { [field]: value }
    });
  };

  const filteredContent = content?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className={`px-2 py-1 rounded-full text-xs flex items-center ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </div>
    );
  };

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <FileVideo className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{content?.length || 0}</div>
                <p className="text-xs text-green-600">Total items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {content?.filter(c => c.status === 'approved').length || 0}
                </div>
                <p className="text-xs text-green-600">Ready to publish</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {content?.filter(c => c.status === 'pending').length || 0}
                </div>
                <p className="text-xs text-yellow-600">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <Star className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {content?.filter(c => c.is_featured).length || 0}
                </div>
                <p className="text-xs text-blue-600">Currently featured</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Eye className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {content?.filter(c => c.is_active).length || 0}
                </div>
                <p className="text-xs text-purple-600">Live content</p>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img 
                              src={content.thumbnail_url || content.poster_url || '/placeholder.svg'} 
                              alt={content.title}
                              className="w-12 h-8 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">{content.title}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {content.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{content.type?.replace('_', ' ')}</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(content.status || 'pending')}
                        </TableCell>
                        <TableCell>{content.view_count?.toLocaleString() || 0}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {content.is_active && (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                            {content.is_featured && (
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Featured
                              </span>
                            )}
                            {!content.is_active && (
                              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'view')}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'edit')}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {content.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleContentAction(content.id, 'approve')}
                                  disabled={updateContentMutation.isPending}
                                  className="text-green-600 hover:text-green-700"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleContentAction(content.id, 'reject')}
                                  disabled={updateContentMutation.isPending}
                                  className="text-red-600 hover:text-red-700"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'feature')}
                              disabled={updateContentMutation.isPending}
                              className={content.is_featured ? "text-blue-600" : ""}
                              title={content.is_featured ? "Remove from featured" : "Add to featured"}
                            >
                              <Star className={`h-4 w-4 ${content.is_featured ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'delete')}
                              disabled={deleteContent.isPending}
                              className="text-red-600 hover:text-red-700"
                              title="Delete"
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
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quick Edit: {selectedContent?.title}</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={selectedContent.status || 'pending'}
                  onValueChange={(value) => handleQuickEdit('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedContent.is_active || false}
                    onChange={(e) => handleQuickEdit('is_active', e.target.checked)}
                  />
                  <span className="text-sm">Active</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedContent.is_featured || false}
                    onChange={(e) => handleQuickEdit('is_featured', e.target.checked)}
                  />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowEditDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ContentManager;
