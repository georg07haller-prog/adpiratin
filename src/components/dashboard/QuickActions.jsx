import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Trophy, Share2, Sparkles } from 'lucide-react';

const actions = [
  { 
    title: 'Report Ad',
    description: 'Bust a shady ad',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-500',
    page: 'ReportAd',
    points: '+25 pts'
  },
  { 
    title: 'Hunt Deals',
    description: 'Find better prices',
    icon: Search,
    color: 'from-[#1e90ff] to-cyan-400',
    page: 'HuntAlternatives',
    points: '+10 pts'
  },
  { 
    title: 'Leaderboard',
    description: 'Check your rank',
    icon: Trophy,
    color: 'from-[#d4af37] to-yellow-500',
    page: 'Leaderboard',
    points: ''
  },
  { 
    title: 'Share & Earn',
    description: 'Create a meme',
    icon: Share2,
    color: 'from-purple-500 to-pink-500',
    page: 'MemeGenerator',
    points: '+5 pts'
  }
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, i) => (
        <Link to={createPageUrl(action.page)} key={action.title}>
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
            <div className="relative bg-[#1a2d4a]/80 backdrop-blur-xl border border-[#2a4a6a]/50 rounded-2xl p-4 h-full group-hover:border-white/20 transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-sm">{action.title}</h3>
              <p className="text-[#8ba3c7] text-xs mt-1">{action.description}</p>
              {action.points && (
                <div className="flex items-center gap-1 mt-2">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span className="text-[#d4af37] text-xs font-medium">{action.points}</span>
                </div>
              )}
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}