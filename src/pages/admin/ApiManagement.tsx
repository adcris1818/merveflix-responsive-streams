
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Shield, Clock, AlertTriangle, Activity, Key, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const ApiManagement = () => {
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data for API usage
  const mockApiData = [
    { time: '00:00', requests: 1200, errors: 5 },
    { time: '04:00', requests: 800, errors: 2 },
    { time: '08:00', requests: 2400, errors: 12 },
    { time: '12:00', requests: 3200, errors: 8 },
    { time: '16:00', requests: 2800, errors: 15 },
    { time: '20:00', requests: 1900, errors: 6 }
  ];

  const mockRateLimits = [
    {
      id: '1',
      endpoint: '/api/content',
      limit: 1000,
      window: '1 hour',
      current_usage: 743,
      users_affected: 0,
      status: 'healthy'
    },
    {
      id: '2',
      endpoint: '/api/user/profile',
      limit: 500,
      window: '1 hour',
      current_usage: 450,
      users_affected: 2,
      status: 'warning'
    },
    {
      id: '3',
      endpoint: '/api/search',
      limit: 2000,
      window: '1 hour',
      current_usage: 1950,
      users_affected: 15,
      status: 'critical'
    }
  ];

  const mockBlockedRequests = [
    {
      id: '1',
      ip: '192.168.1.100',
      endpoint: '/api/content',
      reason: 'Rate limit exceeded',
      timestamp: '2024-01-15T14:30:00Z',
      user_agent: 'Mozilla/5.0...'
    },
    {
      id: '2',
      ip: '10.0.0.50',
      endpoint: '/api/search',
      reason: 'Suspicious activity',
      timestamp: '2024-01-15T14:25:00Z',
      user_agent: 'Python-requests/2.28.1'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="text-green-600">Healthy</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600">Warning</Badge>;
      case 'critical':
        return <Badge variant="outline" className="text-red-600">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUpdateRateLimit = (endpointId: string, newLimit: number) => {
    console.log(`Updating rate limit for ${endpointId} to ${newLimit}`);
    // Implementation would update database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">API Rate Limiting</h1>
              <p className="text-gray-600">Monitor and manage API usage to prevent abuse</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,543</div>
                <p className="text-xs text-green-600">+5.2% from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
                <Shield className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-red-600">Rate limit violations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-green-600">Active users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.3%</div>
                <p className="text-xs text-yellow-600">Within acceptable range</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="limits">Rate Limits</TabsTrigger>
              <TabsTrigger value="blocked">Blocked Requests</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Request Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockApiData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="errors" stroke="#ff7300" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">/api/content</span>
                        <span className="text-sm font-medium">4,523 requests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">/api/search</span>
                        <span className="text-sm font-medium">3,241 requests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">/api/user/profile</span>
                        <span className="text-sm font-medium">2,156 requests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">/api/analytics</span>
                        <span className="text-sm font-medium">1,432 requests</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="limits">
              <Card>
                <CardHeader>
                  <CardTitle>Rate Limit Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Limit</TableHead>
                        <TableHead>Window</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRateLimits.map((limit) => (
                        <TableRow key={limit.id}>
                          <TableCell className="font-medium">{limit.endpoint}</TableCell>
                          <TableCell>{limit.limit.toLocaleString()}</TableCell>
                          <TableCell>{limit.window}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{limit.current_usage}</span>
                                <span>{limit.limit}</span>
                              </div>
                              <Progress 
                                value={(limit.current_usage / limit.limit) * 100} 
                                className="h-2"
                              />
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(limit.status)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blocked">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Blocked Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>User Agent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBlockedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.ip}</TableCell>
                          <TableCell>{request.endpoint}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-red-600">
                              {request.reason}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(request.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.user_agent}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Whitelist
                              </Button>
                              <Button variant="outline" size="sm">
                                Ban
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Rate Limiting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default rate limit (requests per hour)</label>
                      <Input type="number" defaultValue="1000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Burst limit</label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Ban duration (minutes)</label>
                      <Select defaultValue="60">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="1440">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monitoring & Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enable rate limit alerts</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Log blocked requests</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-ban repeat offenders</span>
                      <Button variant="outline" size="sm">Disabled</Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Alert threshold (%)</label>
                      <Input type="number" defaultValue="80" />
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

export default ApiManagement;
