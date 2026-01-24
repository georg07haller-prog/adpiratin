import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Volume2, Ship, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ANTHEM_LYRICS = [
  { time: 0, line: '🏴‍☠️ [Verse 1]' },
  { time: 2, line: 'Ahoy, ye shoppers on the digital sea,' },
  { time: 5, line: 'Sneaky ads lurking, trying to fool thee!' },
  { time: 8, line: '€99 for sneakers that ain\'t worth the price,' },
  { time: 11, line: 'Greenwashing lies – oh, that ain\'t nice!' },
  { time: 14, line: '⚓ [Chorus]' },
  { time: 16, line: 'AdPiratin, hoist the black flag high!' },
  { time: 19, line: 'Spot the DSA label, make those banners die!' },
  { time: 22, line: 'Hunt for deals cheaper, better, eco-true,' },
  { time: 25, line: 'Save your euros – the treasure\'s for you!' },
  { time: 28, line: 'Arrr, plunder the ads, yo ho ho!' },
  { time: 31, line: 'With AdPiratin – fair winds we go!' },
  { time: 34, line: '🎯 [Verse 2]' },
  { time: 36, line: 'Click "Busted!" on lies, earn points for the fight,' },
  { time: 39, line: 'Meme \'em on X – share the pirate light!' },
  { time: 42, line: 'From Berlin cafés to Amsterdam canals,' },
  { time: 45, line: 'We\'re busting fake deals, answering the calls!' },
  { time: 48, line: '⚓ [Chorus - Reprise]' },
  { time: 50, line: 'AdPiratin, hoist the black flag high!' },
  { time: 53, line: 'Hunt for deals cheaper, better, eco-true!' },
  { time: 56, line: 'Arrr, plunder the ads, yo ho ho!' },
  { time: 59, line: 'With AdPiratin – fair winds we go!' },
  { time: 62, line: '💰 [Outro]' },
  { time: 64, line: 'Join the crew now, back us on the go,' },
  { time: 67, line: 'Indiegogo launch – let the treasure flow!' },
  { time: 70, line: 'Yo ho ho – AdPiratin forever!' },
  { time: 73, line: 'Fair shopping ahead – together we endeavor! 🏴‍☠️' }
];

// Optional: Add your audio file URL here after uploading via base44.integrations.Core.UploadFile
const AUDIO_URL = null; // Replace with your uploaded audio URL

export default function AnthemPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (AUDIO_URL && audioRef.current) {
      // Use real audio if available
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else if (isPlaying) {
      // Fallback to timer simulation
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentTime >= 76) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowAnimation(!isPlaying);
    if (!isPlaying) {
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    } else {
      setShowAnimation(false);
    }
  };

  // Update time from real audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setShowAnimation(false);
    setCurrentTime(0);
  };

  const getCurrentLyric = () => {
    const lyric = [...ANTHEM_LYRICS].reverse().find(l => currentTime >= l.time);
    return lyric?.line || ANTHEM_LYRICS[0].line;
  };

  return (
    <div className="relative">
      {/* Hidden Audio Element */}
      {AUDIO_URL && (
        <audio
          ref={audioRef}
          src={AUDIO_URL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnd}
        />
      )}

      {/* Background Animation */}
      <AnimatePresence>
        {showAnimation && (
          <>
            {/* Coins */}
            <div className="fixed inset-0 pointer-events-none z-40">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`coin-${i}`}
                  className="absolute text-3xl"
                  initial={{ 
                    top: -50, 
                    left: `${Math.random() * 100}%`,
                    rotate: 0
                  }}
                  animate={{ 
                    top: '110%',
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 4,
                    delay: Math.random() * 2,
                    repeat: Infinity
                  }}
                >
                  🪙
                </motion.div>
              ))}
            </div>

            {/* Ship */}
            <motion.div
              className="fixed bottom-0 left-0 text-8xl pointer-events-none z-40"
              initial={{ x: '-100%' }}
              animate={{ x: 'calc(100vw + 100%)' }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              ⛵
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Player Card */}
      <Card className="bg-gradient-to-br from-[#1a2d4a] to-[#0f2137] border-[#d4af37]/30 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#d4af37]/20 rounded-xl">
              <Music className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-white font-bold">NovaLibertalia Anthem</h3>
              <p className="text-[#8ba3c7] text-sm">The Official Pirate Song</p>
            </div>
          </div>

          {/* Lyrics Display */}
          <div className="bg-[#0a1628]/50 rounded-xl p-6 mb-6 min-h-[120px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={getCurrentLyric()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-white text-xl font-bold text-center"
              >
                {getCurrentLyric()}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#8ba3c7] text-sm">
              <Volume2 className="w-4 h-4" />
              <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
              <span>/</span>
              <span>1:16</span>
            </div>

            <Button
              onClick={togglePlay}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold px-8"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Sing Along!
                </>
              )}
            </Button>

            <div className="w-20" />
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-[#0a1628]/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd700]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentTime / 76) * 100}%` }}
            />
          </div>

          {!AUDIO_URL && (
            <p className="text-[#5a7a9a] text-xs text-center mt-3">
              ℹ️ Без аудио — только текст и анимация. Загрузите MP3 для полного эффекта!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}