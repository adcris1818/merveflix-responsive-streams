
import React from 'react';
import { Button } from './ui/button';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters?: string[];
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ 
  activeFilter, 
  onFilterChange, 
  filters = ['All Genres', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'] 
}) => {
  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          onClick={() => onFilterChange(filter)}
          className="whitespace-nowrap"
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};
