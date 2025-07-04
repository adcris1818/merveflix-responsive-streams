
import React from 'react';
import { Play, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';

interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  genre: string;
  year: number;
  rating: string;
  duration?: string;
  description?: string;
  progress?: number;
}

interface ContentGridProps {
  items: ContentItem[];
  title?: string;
  showProgress?: boolean;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ items, title, showProgress }) => {
  const navigate = useNavigate();

  const handlePlay = (id: string) => {
    navigate(`/player/${id}`);
  };

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <Card className="bg-transparent border-none overflow-hidden">
              <CardContent className="p-0 relative">
                {/* Thumbnail */}
                <div className="relative aspect-[2/3]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Progress Bar */}
                  {showProgress && item.progress && item.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 rounded-b-lg">
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-red-600 h-1 rounded-full transition-all duration-300" 
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-white mt-1">{item.progress}% watched</p>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-between p-4">
                    {/* Top Actions */}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-400 text-white hover:bg-gray-800 p-2 rounded-full bg-gray-700/70"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Bottom Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => handlePlay(item.id)}
                          className="bg-white text-black hover:bg-gray-200 p-3 rounded-full"
                        >
                          <Play className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-xs text-gray-300 mb-1">
                          <span className="bg-gray-800 px-2 py-1 rounded">{item.rating}</span>
                          <span>{item.year}</span>
                        </div>
                        <p className="text-xs text-gray-400">{item.genre}</p>
                        {item.duration && (
                          <p className="text-xs text-gray-400">{item.duration}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Info */}
                <div className="pt-2 space-y-1">
                  <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>{item.genre}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
