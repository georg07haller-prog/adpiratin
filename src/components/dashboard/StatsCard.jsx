import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const colorMap = {
  red: { bg: 'from-red-500/20 to-red-600/10', icon: 'bg-red-500/20', text: 'text-red-400' },
  orange: { bg: 'from-orange-500/20 to-orange-600/10', icon: 'bg-orange-500/20', text: 'text-orange-400' },
  blue: { bg: 'from-blue-500/20 to-blue-600/10', icon: 'bg-[#1e90ff]/20', text: 'text-[#1e90ff]' },
  gold: { bg: 'from-[#d4af37]/20 to-[#d4af37]/10', icon: 'bg-[#d4af37]/20', text: 'text-[#d4af37]' }
};

export default function StatsCard({ title, value, icon: Icon, color, delay = 0 }) {
  const colors = colorMap[color] || colorMap.blue;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl border-[#2a4a6a]/30 hover:border-[#d4af37]/30 transition-all duration-300`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${colors.icon}`}>
              <Icon className={`w-4 h-4 ${colors.text}`} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">{value}</p>
          <p className="text-[#8ba3c7] text-xs mt-1">{title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}