
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { AlertTriangle, CheckCircle, XCircle, Eye, Flag, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ContentModeration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  // Mock data for content reports - in real app, this would come from database
  const mockReports = [
    {
      id: '1',
      content_id: 'content-1',
      content_title: 'Sample Movie',
      reporter_email: 'user@example.com',
      reason: 'inappropriate_content',
      description: 'Contains violent content not suitable for rated audience',
      status: 'pending',
      created_at: '2024-01-15T10:30:00Z',
      reviewed_at: null,
      moderator_notes: null
    },
    {
      id: '2',
      content_id: 'content-2',
      content_title: 'Another Show',
      reporter_email: 'concerned@example.com',
      reason: 'copyright_violation',
      description: 'This appears to be copyrighted material uploaded without permission',
      status: 'approved',
      created_at: '2024-01-14T15:45:00Z',
      reviewed_at: '2024-01-15T09:15:00Z',
      moderator_notes: 'Content removed and user warned'
    }
  ];

  const handleModerationAction = async (reportId: string, action: 'approve' | 'reject', notes: string) => {
    console.log(`${action} report ${reportId} with notes: ${notes}`);
    // In real app, would update database
    queryClient.invalidateQueries({ queryKey: ['moderation-reports'] });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getReasionLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      'inappropriate_content': 'Inappropriate Content',
      'copyright_violation': 'Copyright Violation',
      'misleading_info': 'Misleading Information',
      'spam': 'Spam',
      'harassment': 'Harassment',
      'other': 'Other'
    };
    return reasons[reason] || reason;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
            <p className="text-gray-600">Review reported content and manage platform safety</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-yellow-600">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-green-600">+4 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Flagged</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-blue-600">AI detected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">False Positives</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-red-600">This week</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="reports">User Reports</TabsTrigger>
              <TabsTrigger value="automated">Automated Flags</TabsTrigger>
              <TabsTrigger value="settings">Moderation Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="reports">
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Reports Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Content</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.content_title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {report.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{report.reporter_email}</TableCell>
                          <TableCell>{getReasionLabel(report.reason)}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            {new Date(report.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {report.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleModerationAction(report.id, 'approve', 'Approved after review')}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleModerationAction(report.id, 'reject', 'No violation found')}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="automated">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Content Scanning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">AI Content Analysis</h3>
                      <p className="text-gray-600 mb-4">Automatically scan uploaded content for policy violations</p>
                      <div className="flex items-center justify-between">
                        <span>Status: Active</span>
                        <Badge variant="outline" className="text-green-600">Running</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Copyright Detection</h3>
                      <p className="text-gray-600 mb-4">Detect potential copyright violations in uploaded content</p>
                      <div className="flex items-center justify-between">
                        <span>Status: Active</span>
                        <Badge variant="outline" className="text-green-600">Running</Badge>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Audio Analysis</h3>
                      <p className="text-gray-600 mb-4">Scan audio tracks for inappropriate content</p>
                      <div className="flex items-center justify-between">
                        <span>Status: Inactive</span>
                        <Badge variant="outline" className="text-gray-400">Disabled</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Moderation Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Auto-approve threshold</label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 report</SelectItem>
                          <SelectItem value="3">3 reports</SelectItem>
                          <SelectItem value="5">5 reports</SelectItem>
                          <SelectItem value="10">10 reports</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">AI confidence threshold</label>
                      <Select defaultValue="80">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60%</SelectItem>
                          <SelectItem value="70">70%</SelectItem>
                          <SelectItem value="80">80%</SelectItem>
                          <SelectItem value="90">90%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email alerts for new reports</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Slack notifications</span>
                      <Button variant="outline" size="sm">Disabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Weekly summary reports</span>
                      <Button variant="outline" size="sm">Enabled</Button>
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

export default ContentModeration;
