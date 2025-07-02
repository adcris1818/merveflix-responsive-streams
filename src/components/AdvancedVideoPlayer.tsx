
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface VideoPlayerProps {
  sources: Array<{
    src: string;
    type: string;
    quality: string;
  }>;
  poster?: string;
  title: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const AdvancedVideoPlayer: React.FC<VideoPlayerProps> = ({
  sources,
  poster,
  title,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState(sources[0]?.quality || 'auto');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const changeQuality = (quality: string) => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    const source = sources.find(s => s.quality === quality);
    if (source) {
      video.src = source.src;
      video.load();
      video.currentTime = currentTime;
      
      if (wasPlaying) {
        video.play();
      }
      
      setSelectedQuality(quality);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  return (
    <div className="relative w-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={poster}
        onClick={togglePlay}
        onMouseMove={() => setShowControls(true)}
      >
        {sources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
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

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-6">
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Playback Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
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
                onClick={() => skip(10)}
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
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Settings Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-4 min-w-48">
                    <div className="space-y-4">
                      {/* Quality Settings */}
                      <div>
                        <h4 className="text-white font-semibold mb-2">Quality</h4>
                        <div className="space-y-1">
                          {sources.map((source) => (
                            <button
                              key={source.quality}
                              onClick={() => changeQuality(source.quality)}
                              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                                selectedQuality === source.quality
                                  ? 'bg-white/20 text-white'
                                  : 'text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {source.quality}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Playback Speed */}
                      <div>
                        <h4 className="text-white font-semibold mb-2">Speed</h4>
                        <div className="space-y-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`block w-full text-left px-2 py-1 rounded text-sm ${
                                playbackRate === rate
                                  ? 'bg-white/20 text-white'
                                  : 'text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
  );
};
