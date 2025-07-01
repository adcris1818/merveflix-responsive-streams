
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { ContentCarousel } from '../components/ContentCarousel';
import { Footer } from '../components/Footer';

const Index = () => {
  const [user, setUser] = useState(null);

  // Mock content data - in production this would come from your backend
  const featuredContent = {
    id: 1,
    title: "The Crown",
    description: "Follow the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    backgroundImage: "/placeholder.svg",
    genre: "Drama",
    year: 2023,
    rating: "TV-MA",
    duration: "4 Seasons"
  };

  const contentSections = [
    {
      title: "Trending Now",
      items: Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Trending Movie ${i + 1}`,
        thumbnail: "/placeholder.svg",
        genre: "Action",
        year: 2023,
        rating: "PG-13"
      }))
    },
    {
      title: "Continue Watching",
      items: Array.from({ length: 8 }, (_, i) => ({
        id: i + 13,
        title: `Continue Series ${i + 1}`,
        thumbnail: "/placeholder.svg",
        genre: "Drama",
        year: 2023,
        rating: "TV-14",
        progress: Math.floor(Math.random() * 80) + 10
      }))
    },
    {
      title: "Netflix Originals",
      items: Array.from({ length: 10 }, (_, i) => ({
        id: i + 21,
        title: `Original Series ${i + 1}`,
        thumbnail: "/placeholder.svg",
        genre: "Sci-Fi",
        year: 2023,
        rating: "TV-MA"
      }))
    },
    {
      title: "Popular Movies",
      items: Array.from({ length: 15 }, (_, i) => ({
        id: i + 31,
        title: `Popular Movie ${i + 1}`,
        thumbnail: "/placeholder.svg",
        genre: "Comedy",
        year: 2023,
        rating: "PG-13"
      }))
    },
    {
      title: "Documentaries",
      items: Array.from({ length: 8 }, (_, i) => ({
        id: i + 46,
        title: `Documentary ${i + 1}`,
        thumbnail: "/placeholder.svg",
        genre: "Documentary",
        year: 2023,
        rating: "TV-PG"
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header user={user} />
      <main>
        <HeroSection content={featuredContent} />
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 space-y-8 md:space-y-12 py-8">
          {contentSections.map((section, index) => (
            <ContentCarousel
              key={index}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
