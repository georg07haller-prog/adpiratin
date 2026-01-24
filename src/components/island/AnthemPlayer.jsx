import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Volume2, Ship, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ANTHEM_LYRICS = [
  { time: 0, line: '🏴‍☠️ Yo-ho, yo-ho, a pirate\'s life for me!' },
  { time: 3, line: 'We fight the ads, we hunt the deals!' },
  { time: 6, line: 'No fake discounts, no lying fees!' },
  { time: 9, line: 'Fair winds and fair prices, we decree!' },
  { time: 12, line: '⚓ From NovaLibertalia, we sail so free!' },
  { time: 15, line: 'With Doubloons bright, our treasure we see!' },
  { time: 18, line: 'The DSA\'s our sword, justice our creed!' },
  { time: 21, line: 'Yo-ho, yo-ho, AdPiratins we be!' },
  { time: 24, line: '💰 Bust the scammers, share the loot!' },
  { time: 27, line: 'From Berlin seas to Dublin\'s route!' },
  { time: 30, line: 'We plunder lies and hoist the truth!' },
  { time: 33, line: 'Yo-ho, yo-ho, forever youth!' }
];

export default function AnthemPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentTime >= 36) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowAnimation(!isPlaying);
    if (!isPlaying) {
      setCurrentTime(0);
    } else {
      setShowAnimation(false);
    }
  };

  const getCurrentLyric = () => {
    const lyric = [...ANTHEM_LYRICS].reverse().find(l => currentTime >= l.time);
    return lyric?.line || ANTHEM_LYRICS[0].line;
  };

  return (
    <div className="relative">
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
              <span>0:36</span>
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
              animate={{ width: `${(currentTime / 36) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}