
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, Clock, Heart, TrendingUp } from 'lucide-react';

const UserDashboard = () => {
  const userStats = [
    { title: 'Watch Time', value: '45h 23m', icon: Clock, description: 'This month' },
    { title: 'Movies Watched', value: '23', icon: Play, description: 'This month' },
    { title: 'My List', value: '12', icon: Heart, description: 'Saved items' },
    { title: 'Streak', value: '7 days', icon: TrendingUp, description: 'Daily viewing' }
  ];

  const recentlyWatched = [
    { title: 'The Matrix', progress: 85, thumbnail: '/placeholder.svg' },
    { title: 'Breaking Bad S5E14', progress: 100, thumbnail: '/placeholder.svg' },
    { title: 'Planet Earth', progress: 45, thumbnail: '/placeholder.svg' }
  ];

  const recommendations = [
    { title: 'Inception', genre: 'Sci-Fi', rating: 8.8, thumbnail: '/placeholder.svg' },
    { title: 'The Dark Knight', genre: 'Action', rating: 9.0, thumbnail: '/placeholder.svg' },
    { title: 'Interstellar', genre: 'Sci-Fi', rating: 8.6, thumbnail: '/placeholder.svg' }
  ];

  return (
    <div className="space-y-8">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Watching */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Watching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentlyWatched.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-red-600 h-1 rounded-full" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.genre} • {item.rating}/10</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
