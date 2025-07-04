
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Flag,
  MessageSquare,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

const ContentModeration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch content for moderation
  const { data: content = [], isLoading: contentLoading } = useQuery({
    queryKey: ['moderation-content', statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch content reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['content-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_reviews')
        .select(`
          *,
          content:content_id (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Update content status mutation
  const updateContentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('content')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-content'] });
      toast.success('Content status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating content status:', error);
      toast.error('Failed to update content status');
    }
  });

  // Approve/reject review mutation
  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await supabase
        .from('content_reviews')
        .update({ is_approved })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-reviews'] });
      toast.success('Review status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  });

  const handleContentAction = (contentId: string, action: 'approve' | 'reject' | 'pending') => {
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      pending: 'pending'
    };
    
    updateContentStatus.mutate({ id: contentId, status: statusMap[action] });
  };

  const handleReviewAction = (reviewId: string, approve: boolean) => {
    updateReviewStatus.mutate({ id: reviewId, is_approved: approve });
  };

  // Filter content based on search term
  const filteredContent = content.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getContentStats = () => {
    const approved = content.filter(c => c.status === 'approved').length;
    const pending = content.filter(c => c.status === 'pending').length;
    const rejected = content.filter(c => c.status === 'rejected').length;
    
    return { approved, pending, rejected, total: content.length };
  };

  const stats = getContentStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
            <p className="text-gray-600">Review and moderate content and user reviews</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-gray-600">Items to moderate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <p className="text-xs text-gray-600">Approved content</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-gray-600">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <p className="text-xs text-gray-600">Rejected content</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList>
              <TabsTrigger value="content">Content Moderation</TabsTrigger>
              <TabsTrigger value="reviews">User Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Filters */}
              <Card>
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
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
                  <CardTitle>Content Review Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  {contentLoading ? (
                    <div className="text-center py-8">Loading content...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContent.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.title}</div>
                              {item.description && (
                                <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                  {item.description}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="capitalize">{item.type?.replace('_', ' ')}</span>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(item.status || 'pending')}
                            </TableCell>
                            <TableCell>{item.view_count?.toLocaleString() || 0}</TableCell>
                            <TableCell>
                              {new Date(item.created_at || '').toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContentAction(item.id, 'approve')}
                                  disabled={updateContentStatus.isPending}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContentAction(item.id, 'reject')}
                                  disabled={updateContentStatus.isPending}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(`/player/${item.id}`, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
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
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="text-center py-8">Loading reviews...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Content</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Review</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviews.map((review) => (
                          <TableRow key={review.id}>
                            <TableCell>
                              <div className="font-medium">
                                {review.content?.title || 'Unknown Content'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1">{review.rating}/5</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs text-sm line-clamp-3">
                                {review.review_text}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {review.is_approved ? 'Approved' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(review.created_at || '').toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewAction(review.id, true)}
                                  disabled={updateReviewStatus.isPending}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewAction(review.id, false)}
                                  disabled={updateReviewStatus.isPending}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentModeration;
