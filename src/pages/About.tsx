
import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
              About <span className="text-red-600">MERFLIX</span>
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-xl mb-8 text-center text-gray-300">
                Your premier destination for unlimited entertainment
              </p>

              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <p className="text-gray-300 mb-4">
                    Founded with a vision to revolutionize how people consume entertainment, 
                    MERFLIX has grown from a small startup to a global streaming platform 
                    serving millions of users worldwide.
                  </p>
                  <p className="text-gray-300">
                    We believe that great content should be accessible to everyone, anywhere, 
                    at any time. That's why we've built a platform that brings together the 
                    best movies, TV shows, and documentaries from around the world.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-8">
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-300">
                    To connect the world through stories by providing unlimited access to 
                    premium entertainment content while supporting creators and storytellers 
                    from diverse backgrounds.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">10M+</div>
                  <p className="text-gray-300">Active Users</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">50K+</div>
                  <p className="text-gray-300">Hours of Content</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">190+</div>
                  <p className="text-gray-300">Countries</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-8 mb-16">
                <h2 className="text-3xl font-bold mb-6 text-center">What Sets Us Apart</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-red-600">Premium Quality</h3>
                    <p className="text-gray-300">
                      4K Ultra HD streaming with Dolby Atmos sound for an immersive experience.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-red-600">Original Content</h3>
                    <p className="text-gray-300">
                      Exclusive MERFLIX Originals you won't find anywhere else.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-red-600">Global Reach</h3>
                    <p className="text-gray-300">
                      Content in over 30 languages with subtitles and dubbing options.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 text-red-600">Smart Recommendations</h3>
                    <p className="text-gray-300">
                      AI-powered suggestions tailored to your viewing preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">Join the MERFLIX Family</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Ready to discover your next favorite show?
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                  Start Your Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
