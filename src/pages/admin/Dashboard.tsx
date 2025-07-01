import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import { 
  Users, 
  PlayCircle, 
  TrendingUp, 
  DollarSign, 
  FileVideo, 
  Shield,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Mock data - replace with actual Supabase edge function call
      return {
        totalUsers: 12543,
        activeSubscriptions: 8932,
        monthlyRevenue: 89432,
        contentViews: 234567,
        totalContent: 1543,
        serverUptime: 99.9
      };
    }
  });

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Premium', status: 'Active', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Basic', status: 'Active', joined: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'Premium', status: 'Cancelled', joined: '2024-01-13' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with Merflix today.</p>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading stats...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Total Users" 
                value={stats?.totalUsers.toLocaleString() || '0'} 
                icon={Users} 
                change="+12%" 
                trend="up" 
              />
              <StatsCard 
                title="Active Subscriptions" 
                value={stats?.activeSubscriptions.toLocaleString() || '0'} 
                icon={UserCheck} 
                change="+8%" 
                trend="up" 
              />
              <StatsCard 
                title="Monthly Revenue" 
                value={`$${stats?.monthlyRevenue.toLocaleString() || '0'}`} 
                icon={DollarSign} 
                change="+15%" 
                trend="up" 
              />
              <StatsCard 
                title="Content Views" 
                value={stats?.contentViews.toLocaleString() || '0'} 
                icon={PlayCircle} 
                change="+22%" 
                trend="up" 
              />
              <StatsCard 
                title="Total Content" 
                value={stats?.totalContent.toLocaleString() || '0'} 
                icon={FileVideo} 
                change="+5%" 
                trend="up" 
              />
              <StatsCard 
                title="Server Uptime" 
                value={`${stats?.serverUptime || 0}%`} 
                icon={Shield} 
                change="0%" 
                trend="neutral" 
              />
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{user.plan}</p>
                            <p className={`text-xs ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                              {user.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">High Server Load</p>
                          <p className="text-xs text-yellow-600">Server load at 85% capacity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Security Update Complete</p>
                          <p className="text-xs text-green-600">All systems updated successfully</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Email</th>
                          <th className="text-left py-2">Plan</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Joined</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-2">{user.name}</td>
                            <td className="py-2">{user.email}</td>
                            <td className="py-2">{user.plan}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-2">{user.joined}</td>
                            <td className="py-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Content management features coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Detailed analytics coming soon...</p>
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

export default AdminDashboard;
