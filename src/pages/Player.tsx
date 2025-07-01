
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [currentTime, setCurrentTime] = useState([0]);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock content data
  const content = {
    id: id,
    title: "Sample Movie Title",
    duration: 7200, // 2 hours in seconds
    videoUrl: "/placeholder.svg", // In production, this would be the actual video URL
    description: "A thrilling adventure that takes you on an unforgettable journey.",
    cast: ["Actor One", "Actor Two", "Actor Three"],
    director: "Director Name",
    year: 2023,
    genre: "Action"
  };

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsMuted(value[0] === 0);
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Player Area */}
      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
        {/* Placeholder for video */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="h-16 w-16 text-white fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{content.title}</h2>
            <p className="text-gray-400">Video player would be integrated here</p>
          </div>
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseMove={() => setShowControls(true)}
          onClick={() => setShowControls(true)}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">{content.title}</h1>
              <p className="text-gray-300 text-sm">{content.year} • {content.genre}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-6"
            >
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white" />
              ) : (
                <Play className="h-12 w-12 text-white fill-current" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={currentTime}
                onValueChange={handleTimeChange}
                max={content.duration}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-300">
                <span>{formatTime(currentTime[0])}</span>
                <span>{formatTime(content.duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Playback Controls */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20 p-2"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 fill-current" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                {/* Volume Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isMuted || volume[0] === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <select className="bg-black/50 text-white border border-gray-600 rounded px-2 py-1 text-sm">
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
