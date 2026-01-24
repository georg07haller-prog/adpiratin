import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Anchor, Skull } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AUDIO_URL = 'https://base44.app/api/apps/6936fd0323c8bf22550d6bd3/files/public/6936fd0323c8bf22550d6bd3/a4d35c5e0_AdPiratinAnthem_PlundertheAds_.mp3';

export default function AnthemPublic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#1e90ff]/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Floating anchors */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + (i % 3) * 30}%`
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          {i % 2 === 0 ? '⚓' : '🏴‍☠️'}
        </motion.div>
      ))}

      <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-[#d4af37]" />
            <h1 className="text-4xl md:text-5xl font-black text-white">
              AdPiratin Anthem
            </h1>
            <Skull className="w-12 h-12 text-[#d4af37]" />
          </div>
          <p className="text-[#8ba3c7] text-lg">
            🏴‍☠️ Plunder the Ads, Save the World 🏴‍☠️
          </p>
        </motion.div>

        {/* Player Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-[#1a2d4a]/80 to-[#0f2137]/80 backdrop-blur-xl border-[#d4af37]/30 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              {/* Big Play Button */}
              <motion.div
                className="mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={togglePlay}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] hover:from-[#b8962e] hover:to-[#d4af37] text-[#0a1628] shadow-2xl"
                >
                  {isPlaying ? (
                    <Pause className="w-16 h-16" />
                  ) : (
                    <Play className="w-16 h-16 ml-2" />
                  )}
                </Button>
              </motion.div>

              {/* Status */}
              <motion.div
                animate={{
                  opacity: isPlaying ? [1, 0.7, 1] : 1
                }}
                transition={{
                  duration: 2,
                  repeat: isPlaying ? Infinity : 0
                }}
              >
                <p className="text-white text-2xl font-bold mb-2">
                  {isPlaying ? '🎵 Playing...' : 'Ready to Listen'}
                </p>
                <p className="text-[#8ba3c7]">
                  {hasInteracted ? 'Enjoy the anthem!' : 'Click play to start'}
                </p>
              </motion.div>

              {/* Volume Indicator */}
              {isPlaying && (
                <motion.div 
                  className="mt-6 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Volume2 className="w-5 h-5 text-[#d4af37]" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-[#d4af37] rounded-full"
                        animate={{
                          height: [10, 20, 10]
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Decorative Elements */}
              <div className="mt-8 flex justify-center gap-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Anchor className="w-8 h-8 text-[#d4af37]/50" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  🏴‍☠️
                </motion.div>
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Anchor className="w-8 h-8 text-[#d4af37]/50" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-[#8ba3c7] text-sm">
            Want to unlock the full karaoke experience? 🎤
          </p>
          <p className="text-[#d4af37] text-sm font-bold">
            Earn 1000 points and visit NovaLibertalia Island!
          </p>
        </motion.div>
      </div>

      <audio ref={audioRef} src={AUDIO_URL} />
    </div>
  );
}