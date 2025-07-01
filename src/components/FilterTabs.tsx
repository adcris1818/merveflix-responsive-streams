
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface FilterTab {
  id: string;
  label: string;
  count: number;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="mb-8">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="bg-gray-900 p-1 flex-wrap h-auto gap-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              {tab.label}
              <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
