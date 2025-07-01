
import React, { useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface HeaderProps {
  user?: any;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { name: 'Home', href: '/', active: true },
    { name: 'TV Shows', href: '/tv-shows' },
    { name: 'Movies', href: '/movies' },
    { name: 'New & Popular', href: '/new' },
    { name: 'My List', href: '/my-list' },
    { name: 'Browse by Languages', href: '/browse' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 font-bold text-2xl md:text-3xl">MERFLIX</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors hover:text-gray-300 ${
                  item.active ? 'text-white font-semibold' : 'text-gray-400'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block">
            {isSearchOpen ? (
              <div className="flex items-center bg-black/80 border border-gray-700 rounded px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Search titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 w-64"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2 p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="p-2"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-black border-gray-800">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Profile Section */}
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
                  <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Guest User</p>
                    <p className="text-gray-400 text-sm">Free Account</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col space-y-3">
                  {navigationItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-base transition-colors hover:text-gray-300 ${
                        item.active ? 'text-white font-semibold' : 'text-gray-400'
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                {/* Account Actions */}
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <a href="/account" className="block text-gray-400 hover:text-white transition-colors">
                    Account
                  </a>
                  <a href="/help" className="block text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                  <a href="/signout" className="block text-gray-400 hover:text-white transition-colors">
                    Sign out
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm p-4 border-t border-gray-800">
          <div className="flex items-center bg-gray-900 rounded-lg px-4 py-3">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <Input
              type="text"
              placeholder="Search titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 flex-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
