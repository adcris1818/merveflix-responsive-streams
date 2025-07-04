
import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { 
  Users, 
  FileVideo, 
  CreditCard, 
  TrendingUp, 
  Eye,
  Download,
  UserCheck,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const [usersResult, contentResult, paymentsResult, analyticsResult] = await Promise.all([
        supabase.from('users').select('id, created_at, subscription_status').order('created_at', { ascending: false }),
        supabase.from('content').select('id, view_count, created_at, type').order('created_at', { ascending: false }),
        supabase.from('payments').select('amount, status, created_at').eq('status', 'completed'),
        supabase.from('analytics_events').select('event_type, created_at').order('created_at', { ascending: false }).limit(1000)
      ]);

      const users = usersResult.data || [];
      const content = contentResult.data || [];
      const payments = paymentsResult.data || [];
      const analytics = analyticsResult.data || [];

      // Calculate stats
      const totalUsers = users.length;
      const activeSubscribers = users.filter(u => u.subscription_status === 'active').length;
      const totalContent = content.length;
      const totalViews = content.reduce((sum, c) => sum + (c.view_count || 0), 0);
      const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

      // Recent activity data for charts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const userGrowthData = last7Days.map(date => {
        const count = users.filter(u => u.created_at?.startsWith(date)).length;
        return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), users: count };
      });

      const viewsData = last7Days.map(date => {
        const count = analytics.filter(a => a.created_at?.startsWith(date) && a.event_type === 'view').length;
        return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), views: count };
      });

      const revenueData = last7Days.map(date => {
        const amount = payments
          .filter(p => p.created_at?.startsWith(date))
          .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), revenue: amount };
      });

      return {
        totalUsers,
        activeSubscribers,
        totalContent,
        totalViews,
        totalRevenue,
        userGrowthData,
        viewsData,
        revenueData,
        recentUsers: users.slice(0, 5),
        popularContent: content.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5)
      };
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminSidebar />
        <main className="ml-64 pt-20">
          <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminSidebar />
      
      <main className="ml-64 pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-green-600">
                  +{stats?.userGrowthData?.reduce((sum, d) => sum + d.users, 0) || 0} this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats?.activeSubscribers || 0}</div>
                <p className="text-xs text-gray-600">
                  {stats?.totalUsers ? Math.round((stats.activeSubscribers / stats.totalUsers) * 100) : 0}% conversion rate
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content</CardTitle>
                <FileVideo className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats?.totalContent || 0}</div>
                <p className="text-xs text-gray-600">Videos & Shows</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-green-600">
                  +${stats?.revenueData?.reduce((sum, d) => sum + d.revenue, 0).toFixed(2) || '0.00'} this week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.userGrowthData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Views</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.viewsData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Popular Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentUsers?.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-600">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.subscription_status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscription_status || 'Free'}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No recent users</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.popularContent?.map((content, index) => (
                    <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{content.title}</p>
                        <p className="text-sm text-gray-600 capitalize">{content.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="h-4 w-4 mr-1" />
                          {content.view_count?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No content available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
