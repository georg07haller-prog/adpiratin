import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AchievementBadge({ name, description, earned, icon }) {
  return (
    <motion.div 
      className={`relative p-4 rounded-2xl border transition-all duration-300 ${
        earned 
          ? 'bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border-[#d4af37]/30' 
          : 'bg-[#0a1628]/50 border-[#2a4a6a]/30 opacity-60'
      }`}
      whileHover={{ scale: earned ? 1.05 : 1 }}
    >
      <div className="text-center">
        <div className="text-3xl mb-2 relative inline-block">
          {icon}
          {!earned && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]/70 rounded-full">
              <Lock className="w-4 h-4 text-[#5a7a9a]" />
            </div>
          )}
        </div>
        <h4 className={`font-bold text-sm ${earned ? 'text-[#d4af37]' : 'text-[#5a7a9a]'}`}>
          {name}
        </h4>
        <p className="text-[#8ba3c7] text-xs mt-1">{description}</p>
      </div>
      {earned && (
        <motion.div 
          className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4af37] rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <span className="text-[#0a1628] text-xs">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
}