import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Eye, Target, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome Aboard! 🏴‍☠️',
    description: 'Learn to hunt overpriced ads and earn rewards!',
    icon: Sparkles,
    position: 'bottom-right',
    highlight: null
  },
  {
    id: 'scan',
    title: 'Scan for Shady Ads',
    description: 'Our AI detects fake discounts and dark patterns automatically.',
    icon: Eye,
    position: 'top-right',
    highlight: '.stats-card',
    action: 'Check "Ads Killed" to see your progress!'
  },
  {
    id: 'actions',
    title: 'Choose Your Action',
    description: '🔍 Hunt cheaper alternatives, 🔇 Kill the ad, or 🚨 Report violations.',
    icon: Target,
    position: 'bottom-right',
    highlight: '.quick-actions',
    action: 'Try "Hunt Deals" or "Report Ad"!'
  },
  {
    id: 'rewards',
    title: 'Earn Points',
    description: 'Report (+25 pts), Hunt (+15 pts), Kill (+5 pts). Climb ranks!',
    icon: Zap,
    position: 'bottom-right',
    highlight: '.pirate-profile',
    action: 'Points shown at top — level up!'
  },
  {
    id: 'complete',
    title: 'Ready to Sail! ⚓',
    description: 'Now go hunt those overpriced ads! Fair winds, fair prices!',
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
            className={`fixed z-[52] ${getCardPosition()} max-w-sm mx-4`}
          >
            <Card className="bg-gradient-to-br from-[#1a2d4a] to-[#0f2137] border-[#d4af37] shadow-2xl overflow-hidden">
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-[#d4af37] to-[#ffd700]" />

              <CardContent className="p-4">
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center mb-3">
                  <step.icon className="w-6 h-6 text-[#0a1628]" />
                </div>

                {/* Content */}
                <h3 className="text-white text-lg font-bold mb-1.5">{step.title}</h3>
                <p className="text-[#c4d4e4] text-sm mb-3 leading-snug">{step.description}</p>

                {step.action && (
                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg p-2 mb-3">
                    <p className="text-[#d4af37] text-xs font-medium">💡 {step.action}</p>
                  </div>
                )}

                {/* Progress */}
                <div className="flex items-center gap-2 mb-3">
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
                    className="w-full text-center text-[#5a7a9a] hover:text-[#8ba3c7] text-xs mt-2 transition-colors"
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