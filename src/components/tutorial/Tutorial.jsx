import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Eye, Target, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome Aboard, Pirate! 🏴‍☠️',
    description: 'Ready to learn how to hunt overpriced ads and earn rewards? This quick tour will show you the ropes!',
    icon: Sparkles,
    position: 'center',
    highlight: null
  },
  {
    id: 'scan',
    title: 'Scan for Shady Ads',
    description: 'Browse any website and our AI will automatically detect sponsored content, fake discounts, and dark patterns in real-time.',
    icon: Eye,
    position: 'top-right',
    highlight: '.stats-card',
    action: 'Look for the "Ads Killed" stat — that\'s how many you\'ve exposed!'
  },
  {
    id: 'actions',
    title: 'Choose Your Action',
    description: 'When we spot a suspicious ad, you have 3 options: 🔍 Hunt for cheaper alternatives, 🔇 Kill (hide) the ad, or 🚨 BUST and report it to authorities.',
    icon: Target,
    position: 'center',
    highlight: '.quick-actions',
    action: 'Try clicking "Hunt Deals" or "Report Ad" to get started!'
  },
  {
    id: 'rewards',
    title: 'Earn Pirate Points',
    description: 'Every action earns you points! Report violations (+25-35 pts), find alternatives (+15 pts), or kill ads (+5 pts). Climb ranks from Deck Swabber to Golden Galleon!',
    icon: Zap,
    position: 'top-left',
    highlight: '.pirate-profile',
    action: 'Your points are shown at the top. Complete actions to level up!'
  },
  {
    id: 'complete',
    title: 'You\'re Ready to Sail! ⚓',
    description: 'That\'s all you need to know. Now go forth and plunder those overpriced ads! Fair winds, fair prices!',
    icon: Sparkles,
    position: 'center',
    highlight: null
  }
];

export default function Tutorial({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState(null);

  const step = TUTORIAL_STEPS[currentStep];

  useEffect(() => {
    if (!isOpen) return;

    const updateHighlight = () => {
      if (step.highlight) {
        const element = document.querySelector(step.highlight);
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightRect({
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16
          });
        }
      } else {
        setHighlightRect(null);
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    return () => window.removeEventListener('resize', updateHighlight);
  }, [isOpen, step.highlight]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    localStorage.setItem('adpiratin_tutorial_completed', 'true');
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('adpiratin_tutorial_completed', 'skipped');
    onClose();
  };

  if (!isOpen) return null;

  const getCardPosition = () => {
    switch (step.position) {
      case 'top-right':
        return 'top-20 right-4 md:right-8';
      case 'top-left':
        return 'top-20 left-4 md:left-8';
      case 'bottom-right':
        return 'bottom-8 right-4 md:right-8';
      case 'bottom-left':
        return 'bottom-8 left-4 md:left-8';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-auto';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Spotlight Highlight */}
          {highlightRect && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed z-[51] pointer-events-none"
              style={{
                top: highlightRect.top,
                left: highlightRect.left,
                width: highlightRect.width,
                height: highlightRect.height,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.5)',
                borderRadius: '16px',
                border: '3px solid rgba(212, 175, 55, 0.5)'
              }}
            />
          )}

          {/* Tutorial Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed z-[52] ${getCardPosition()} max-w-md mx-4`}
          >
            <Card className="bg-gradient-to-br from-[#1a2d4a] to-[#0f2137] border-[#d4af37] shadow-2xl overflow-hidden">
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-[#d4af37] to-[#ffd700]" />

              <CardContent className="p-6">
                {/* Close button */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleSkip}
                  className="absolute top-3 right-3 text-[#8ba3c7] hover:text-white hover:bg-[#2a4a6a]"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-[#0a1628]" />
                </div>

                {/* Content */}
                <h3 className="text-white text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-[#c4d4e4] mb-4 leading-relaxed">{step.description}</p>

                {step.action && (
                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg p-3 mb-4">
                    <p className="text-[#d4af37] text-sm font-medium">💡 {step.action}</p>
                  </div>
                )}

                {/* Progress */}
                <div className="flex items-center gap-2 mb-4">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        i <= currentStep ? 'bg-[#d4af37]' : 'bg-[#2a4a6a]'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="text-[#8ba3c7] hover:text-white disabled:opacity-30"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <div className="text-[#5a7a9a] text-sm">
                    {currentStep + 1} / {TUTORIAL_STEPS.length}
                  </div>

                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                  >
                    {currentStep === TUTORIAL_STEPS.length - 1 ? (
                      <>
                        Start Hunting!
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Skip link */}
                {currentStep < TUTORIAL_STEPS.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="w-full text-center text-[#5a7a9a] hover:text-[#8ba3c7] text-sm mt-3 transition-colors"
                  >
                    Skip tutorial
                  </button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}