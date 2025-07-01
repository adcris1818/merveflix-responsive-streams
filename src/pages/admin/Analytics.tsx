
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BarChart3, TrendingUp, Users, PlayCircle, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');

  // Mock data - would come from Supabase analytics
  const userGrowthData = [
    { month: 'Jan', users: 1200, subscribers: 800 },
    { month: 'Feb', users: 1500, subscribers: 1100 },
    { month: 'Mar', users: 1800, subscribers: 1300 },
    { month: 'Apr', users: 2200, subscribers: 1600 },
    { month: 'May', users: 2800, subscribers: 2100 },
    { month: 'Jun', users: 3400, subscribers: 2600 }
  ];

  const contentViewsData = [
    { name: 'Movies', views: 15420, percentage: 45 },
    { name: 'TV Shows', views: 12350, percentage: 36 },
    { name: 'Documentaries', views: 6580, percentage: 19 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12400 },
    { month: 'Feb', revenue: 15600 },
    { month: 'Mar', revenue: 18200 },
    { month: 'Apr', revenue: 22100 },
    { month: 'May', revenue: 28900 },
    { month: 'Jun', revenue: 34200 }
  ];

  const deviceData = [
    { device: 'Desktop', users: 8500, color: '#8884d8' },
    { device: 'Mobile', users: 12300, color: '#82ca9d' },
    { device: 'Tablet', users: 4200, color: '#ffc658' },
    { device: 'TV', users: 3800, color: '#ff7300' }
  ];

  const chartConfig = {
    users: { label: 'Users', color: '#8884d8' },
    subscribers: { label: 'Subscribers', color: '#82ca9d' },
    revenue: { label: 'Revenue', color: '#8884d8' },
    views: { label: 'Views', color: '#82ca9d' }
  };

  const handleExport = () => {
    console.log('Exporting analytics data...');
    // Implement analytics export
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Detailed insights and performance metrics</p>
            </div>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$134,200</div>
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28,800</div>
                <p className="text-xs text-green-600">+8.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Views</CardTitle>
                <PlayCircle className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">456,789</div>
                <p className="text-xs text-green-600">+15.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6.2%</div>
                <p className="text-xs text-green-600">+0.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="subscribers" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Content Views */}
            <Card>
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <PieChart>
                    <Pie
                      data={contentViewsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="views"
                    >
                      {contentViewsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Device Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={deviceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="device" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="users" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Views</th>
                      <th className="text-left py-2">Duration Watched</th>
                      <th className="text-left py-2">Completion Rate</th>
                      <th className="text-left py-2">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">The Dark Knight</td>
                      <td className="py-2">Movie</td>
                      <td className="py-2">12,543</td>
                      <td className="py-2">2h 32m avg</td>
                      <td className="py-2">89%</td>
                      <td className="py-2">4.8/5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Breaking Bad</td>
                      <td className="py-2">TV Show</td>
                      <td className="py-2">8,921</td>
                      <td className="py-2">45m avg</td>
                      <td className="py-2">92%</td>
                      <td className="py-2">4.9/5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Planet Earth</td>
                      <td className="py-2">Documentary</td>
                      <td className="py-2">6,234</td>
                      <td className="py-2">38m avg</td>
                      <td className="py-2">76%</td>
                      <td className="py-2">4.7/5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analytics;
