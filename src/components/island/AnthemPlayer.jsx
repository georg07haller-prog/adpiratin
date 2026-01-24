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
  { time: 53, line: 'Hunt for deals cheaper, better, eco-true,' },
  { time: 56, line: 'Arrr, plunder the ads, yo ho ho!' },
  { time: 59, line: 'With AdPiratin – fair winds we go!' },
  { time: 62, line: '💰 [Outro]' },
  { time: 64, line: 'Join the crew now, back us on the go,' },
  { time: 67, line: 'Indiegogo launch – let the treasure flow!' },
  { time: 70, line: 'Yo ho ho – AdPiratin forever!' },
  { time: 73, line: 'Fair shopping ahead – together we endeavor! 🏴‍☠️' }
];

const AUDIO_URL = 'https://base44.app/api/apps/6936fd0323c8bf22550d6bd3/files/public/6936fd0323c8bf22550d6bd3/a4d35c5e0_AdPiratinAnthem_PlundertheAds_.mp3';

export default function AnthemPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (AUDIO_URL && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentTime >= 76) {
      setIsPlaying(false);
      setShowFireworks(false);
      setCurrentTime(0);
    }
  }, [currentTime]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setShowFireworks(false);
      } else {
        audioRef.current.play();
        setShowFireworks(true);
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
      setShowFireworks(!isPlaying);
      if (!isPlaying) {
        setCurrentTime(0);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setShowFireworks(false);
    setCurrentTime(0);
  };

  const getCurrentLyric = () => {
    const lyric = [...ANTHEM_LYRICS].reverse().find(l => currentTime >= l.time);
    return lyric?.line || ANTHEM_LYRICS[0].line;
  };

  return (
    <div className="relative">
      {AUDIO_URL && (
        <audio
          ref={audioRef}
          src={AUDIO_URL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnd}
        />
      )}

      {/* Pirate-themed background animations */}
      <AnimatePresence>
        {showFireworks && (
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {/* Floating treasure and pirate elements */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`treasure-${i}`}
                className="absolute text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0],
                  y: [0, -80],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                {['💎', '🪙', '⚓', '🏴‍☠️', '💰', '⛵', '🗡️', '🦜'][i % 8]}
              </motion.div>
            ))}
            
            {/* Sailing ship */}
            <motion.div
              className="absolute bottom-10 text-8xl"
              initial={{ x: '-10%' }}
              animate={{ x: '110vw' }}
              transition={{ duration: 15, repeat: Infinity }}
            >
              🚢
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Karaoke Card */}
      <Card className="bg-gradient-to-br from-[#1a2d4a] to-[#0f2137] border-[#d4af37]/30 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#d4af37]/20 rounded-xl">
              <Music className="w-6 h-6 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">🎤 NovaLibertalia Karaoke</h3>
              <p className="text-[#8ba3c7] text-sm">Sing along, matey!</p>
            </div>
          </div>

          {/* Karaoke Lyrics Display */}
          <div className="bg-black/40 rounded-xl p-8 mb-6 min-h-[180px] flex flex-col items-center justify-center backdrop-blur-sm border border-[#d4af37]/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={getCurrentLyric()}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <motion.p 
                  className="text-3xl md:text-5xl font-black leading-tight px-4 bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                >
                  {getCurrentLyric()}
                </motion.p>
                
                {isPlaying && (
                  <motion.div 
                    className="mt-4 text-3xl"
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity 
                    }}
                  >
                    🏴‍☠️ ⚔️ 🏴‍☠️
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {isPlaying && (
              <motion.p
                className="absolute bottom-4 text-[#8ba3c7] text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎤 Sing loud and proud! 🎤
              </motion.p>
            )}
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
              className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold px-8 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Karaoke!
                </>
              )}
            </Button>

            <div className="w-20" />
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-[#0a1628]/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37]"
              initial={{ width: 0 }}
              animate={{ width: `${(currentTime / 76) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}