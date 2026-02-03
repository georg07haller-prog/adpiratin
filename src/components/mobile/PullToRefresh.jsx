import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);
  
  const PULL_THRESHOLD = 80;
  const MAX_PULL = 120;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let isAtTop = false;

    const handleTouchStart = (e) => {
      if (container.scrollTop === 0) {
        isAtTop = true;
        touchStartY = e.touches[0].clientY;
        startY.current = touchStartY;
      } else {
        isAtTop = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!isAtTop || refreshing) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY;

      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        const pull = Math.min(distance * 0.5, MAX_PULL);
        setPullDistance(pull);
        setPulling(true);
      }
    };

    const handleTouchEnd = async () => {
      if (pulling && pullDistance >= PULL_THRESHOLD && !refreshing) {
        setRefreshing(true);
        try {
          await onRefresh();
        } catch (err) {
          console.error('Refresh failed:', err);
        }
        setTimeout(() => {
          setRefreshing(false);
          setPullDistance(0);
          setPulling(false);
        }, 500);
      } else {
        setPullDistance(0);
        setPulling(false);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, pullDistance, refreshing, onRefresh]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto overscroll-none">
      <AnimatePresence>
        {(pulling || refreshing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: Math.max(pullDistance, refreshing ? 60 : 0) 
            }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotate: refreshing ? 360 : pullDistance >= PULL_THRESHOLD ? 180 : 0,
                scale: refreshing ? 1 : Math.min(pullDistance / PULL_THRESHOLD, 1)
              }}
              transition={{ 
                rotate: refreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }
              }}
            >
              <RefreshCw className={`w-6 h-6 ${pullDistance >= PULL_THRESHOLD ? 'text-[#d4af37]' : 'text-[#8ba3c7]'}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}