
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Play, 
  Heart,
  Star,
  Smartphone,
  Monitor,
  Tv
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const steps = [
    { title: 'Welcome to Merflix', subtitle: 'Let\'s personalize your experience' },
    { title: 'What do you like to watch?', subtitle: 'Select your favorite genres' },
    { title: 'How do you watch?', subtitle: 'Choose your preferred devices' },
    { title: 'All set!', subtitle: 'Your personalized experience is ready' }
  ];

  const genres = [
    'Action & Adventure',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi & Fantasy',
    'Documentary',
    'Romance',
    'Thriller',
    'Animation',
    'Crime',
    'Family',
    'International'
  ];

  const devices = [
    { name: 'Smart TV', icon: Tv, description: 'Watch on your living room TV' },
    { name: 'Computer', icon: Monitor, description: 'Stream on desktop or laptop' },
    { name: 'Mobile & Tablet', icon: Smartphone, description: 'Watch on the go' }
  ];

  const featuredContent = [
    { title: 'The Crown', genre: 'Drama', image: '/placeholder.svg' },
    { title: 'Stranger Things', genre: 'Sci-Fi', image: '/placeholder.svg' },
    { title: 'The Office', genre: 'Comedy', image: '/placeholder.svg' },
    { title: 'Breaking Bad', genre: 'Thriller', image: '/placeholder.svg' }
  ];

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleDevice = (device: string) => {
    setSelectedDevices(prev => 
      prev.includes(device) 
        ? prev.filter(d => d !== device)
        : [...prev, device]
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20">
        <div className="px-4 md:px-8 lg:px-12 xl:px-16 py-8">
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-red-600' : 'bg-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {steps[currentStep].title}
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              {steps[currentStep].subtitle}
            </p>

            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {featuredContent.map((content, index) => (
                    <Card key={index} className="bg-gray-900 border-gray-700 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gray-800 relative">
                          <img
                            src={content.image}
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-white">{content.title}</h3>
                          <p className="text-sm text-gray-400">{content.genre}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-gray-300">
                  Unlimited movies, TV shows and more. Watch anywhere. Cancel anytime.
                </p>
              </div>
            )}

            {/* Step 1: Genre Selection */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedGenres.includes(genre)
                        ? 'border-red-600 bg-red-600 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-left">{genre}</span>
                      {selectedGenres.includes(genre) && (
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Device Selection */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {devices.map((device) => {
                  const Icon = device.icon;
                  return (
                    <button
                      key={device.name}
                      onClick={() => toggleDevice(device.name)}
                      className={`p-8 rounded-lg border-2 transition-all ${
                        selectedDevices.includes(device.name)
                          ? 'border-red-600 bg-red-600 bg-opacity-20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">{device.name}</h3>
                      <p className="text-gray-400">{device.description}</p>
                      {selectedDevices.includes(device.name) && (
                        <div className="mt-4">
                          <Check className="w-6 h-6 mx-auto text-green-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Completion */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your profile is ready!</h2>
                  <p className="text-gray-400 mb-8">
                    Based on your preferences, we've curated a personalized experience just for you.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {selectedGenres.slice(0, 4).map((genre) => (
                      <div key={genre} className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-3">
                        <Star className="w-5 h-5 text-red-500 mb-2" />
                        <p className="text-sm">{genre}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={() => window.location.href = '/'}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Start Watching
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={
                    (currentStep === 1 && selectedGenres.length === 0) ||
                    (currentStep === 2 && selectedDevices.length === 0)
                  }
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Onboarding;
