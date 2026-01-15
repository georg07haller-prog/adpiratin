import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, Target, Eye, EyeOff, AlertTriangle, Search, 
  Trophy, Coins, Anchor, Ship, Sparkles, Share2, ChevronRight,
  Shield, Zap, Crown, HelpCircle, TrendingDown, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import AchievementBadge from '@/components/dashboard/AchievementBadge';
import Tutorial from '@/components/tutorial/Tutorial';

const RANKS = [
  { name: 'Deck Swabber', min: 0, max: 99, icon: Anchor },
  { name: 'Crew Mate', min: 100, max: 499, icon: Ship },
  { name: 'Sly Sniper', min: 500, max: 999, icon: Target },
  { name: 'Captains Cutlass', min: 1000, max: 2499, icon: Skull },
  { name: 'Treasure Hunter', min: 2500, max: 4999, icon: Coins },
  { name: 'Golden Galleon', min: 5000, max: Infinity, icon: Crown }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showCoins, setShowCoins] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    
    // Check if tutorial should be shown
    const tutorialCompleted = localStorage.getItem('adpiratin_tutorial_completed');
    if (!tutorialCompleted) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

  // Get savings from localStorage
  const getSavingsData = () => {
    const savings = localStorage.getItem('adpiratin_savings');
    if (!savings) return { week: 0, month: 0, total: 0 };
    return JSON.parse(savings);
  };

  const [savingsData, setSavingsData] = useState(getSavingsData());

  const { data: pirateProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: reports } = useQuery({
    queryKey: ['userReports', user?.email],
    queryFn: () => base44.entities.AdReport.filter({ reporter_anonymous_id: user?.id }),
    enabled: !!user?.id
  });

  const profile = pirateProfile?.[0];
  const currentRank = RANKS.find(r => 
    (profile?.total_points || 0) >= r.min && (profile?.total_points || 0) <= r.max
  ) || RANKS[0];
  const nextRank = RANKS[RANKS.indexOf(currentRank) + 1];
  const progressToNext = nextRank 
    ? ((profile?.total_points || 0) - currentRank.min) / (nextRank.min - currentRank.min) * 100
    : 100;

  const createProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.PirateUser.create(data),
    onSuccess: () => queryClient.invalidateQueries(['pirateProfile'])
  });

  useEffect(() => {
    if (user?.email && pirateProfile && pirateProfile.length === 0) {
      createProfileMutation.mutate({
        user_email: user.email,
        pirate_name: `Pirate_${Math.random().toString(36).substring(7)}`,
        total_points: 50,
        ads_killed: 0,
        ads_reported: 0,
        alternatives_found: 0,
        rank: 'Deck Swabber',
        achievements: []
      });
      setShowCoins(true);
      setTimeout(() => setShowCoins(false), 3000);
    }
  }, [user, pirateProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#1e90ff]/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Falling coins animation */}
      <AnimatePresence>
        {showCoins && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  top: -50, 
                  left: `${Math.random() * 100}%`,
                  rotate: 0,
                  scale: 0.5
                }}
                animate={{ 
                  top: '110%',
                  rotate: [0, 180, 360, 540],
                  scale: [0.5, 1.2, 1, 0.8]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2 + Math.random() * 1.5,
                  delay: Math.random() * 0.3,
                  ease: "easeOut"
                }}
              >
                <div className="text-4xl drop-shadow-lg">
                  {i % 3 === 0 ? '🪙' : i % 3 === 1 ? '💰' : '⚓'}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-xl">
                <Skull className="w-8 h-8 text-[#0a1628]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  AdPiratin
                </h1>
                <p className="text-[#d4af37] text-sm font-medium">
                  Arrr you ready to plunder overpriced ads?
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTutorial(true)}
              className="text-[#8ba3c7] hover:text-[#d4af37] hover:bg-[#1a2d4a]"
              title="Show tutorial"
            >
              <HelpCircle className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pirate-profile"
        >
          <Card className="bg-gradient-to-r from-[#1a2d4a]/80 to-[#0f2137]/80 backdrop-blur-xl border-[#d4af37]/20 mb-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#d4af37]/10 to-transparent" />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8b7730] flex items-center justify-center">
                      {React.createElement(currentRank.icon, { className: "w-8 h-8 text-[#0a1628]" })}
                    </div>
                    <motion.div 
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1e90ff] rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-[#8ba3c7] text-sm">Welcome back,</p>
                    <h2 className="text-white text-xl font-bold">
                      {profile?.pirate_name || user?.full_name || 'Brave Pirate'}
                    </h2>
                    <Badge className="mt-1 bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                      {currentRank.name}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-3xl font-black text-white">
                      {profile?.total_points?.toLocaleString() || 50}
                    </span>
                    <span className="text-[#8ba3c7]">pts</span>
                  </div>
                  {nextRank && (
                    <div className="w-48">
                      <div className="flex justify-between text-xs text-[#8ba3c7] mb-1">
                        <span>{currentRank.name}</span>
                        <span>{nextRank.name}</span>
                      </div>
                      <Progress value={progressToNext} className="h-2 bg-[#1a2d4a]" />
                      <p className="text-xs text-[#8ba3c7] mt-1 text-right">
                        {nextRank.min - (profile?.total_points || 0)} pts to next rank
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stats-card">
          <StatsCard 
            title="Ads Killed" 
            value={profile?.ads_killed || 0}
            icon={EyeOff}
            color="red"
            delay={0.2}
          />
          <StatsCard 
            title="Ads Reported" 
            value={profile?.ads_reported || 0}
            icon={AlertTriangle}
            color="orange"
            delay={0.3}
          />
          <StatsCard 
            title="Alternatives" 
            value={profile?.alternatives_found || 0}
            icon={Search}
            color="blue"
            delay={0.4}
          />
          <StatsCard 
            title="Monthly Rank" 
            value={`#${Math.floor(Math.random() * 50) + 1}`}
            icon={Trophy}
            color="gold"
            delay={0.5}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 quick-actions"
        >
          <QuickActions />
        </motion.div>

        {/* Savings Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border-emerald-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-400/10 to-transparent" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Wallet className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Your Savings Tracker</h3>
                  <p className="text-emerald-400 text-sm">Money saved by hunting deals</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[#0a1628]/30 rounded-xl">
                  <p className="text-2xl font-black text-emerald-400">€{savingsData.week.toFixed(2)}</p>
                  <p className="text-[#8ba3c7] text-xs mt-1">This Week</p>
                </div>
                <div className="text-center p-3 bg-[#0a1628]/30 rounded-xl">
                  <p className="text-2xl font-black text-emerald-400">€{savingsData.month.toFixed(2)}</p>
                  <p className="text-[#8ba3c7] text-xs mt-1">This Month</p>
                </div>
                <div className="text-center p-3 bg-[#0a1628]/30 rounded-xl">
                  <p className="text-2xl font-black text-[#d4af37]">€{savingsData.total.toFixed(2)}</p>
                  <p className="text-[#8ba3c7] text-xs mt-1">All Time</p>
                </div>
              </div>
              {savingsData.total > 0 && (
                <motion.div 
                  className="mt-4 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(Math.min(Math.floor(savingsData.total / 20), 10))].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-2xl"
                    >
                      💰
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <RecentActivity reports={reports || []} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1e90ff]" />
                  DSA 2025 Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { text: 'Ads must be clearly labeled', icon: Eye },
                  { text: 'No dark patterns allowed', icon: AlertTriangle },
                  { text: 'Price history required for sales', icon: Coins },
                  { text: 'Eco-claims must be verified', icon: Sparkles }
                ].map((fact, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1628]/50 border border-[#2a4a6a]/30">
                    <div className="p-2 rounded-lg bg-[#1e90ff]/20">
                      <fact.icon className="w-4 h-4 text-[#1e90ff]" />
                    </div>
                    <span className="text-[#c4d4e4] text-sm">{fact.text}</span>
                  </div>
                ))}
                <Link to={createPageUrl('DSAGuide')}>
                  <Button variant="ghost" className="w-full text-[#d4af37] hover:bg-[#d4af37]/10 mt-2">
                    Learn More About DSA
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#d4af37]" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AchievementBadge 
                  name="First Blood"
                  description="Report your first ad"
                  earned={(profile?.ads_reported || 0) >= 1}
                  icon="🎯"
                />
                <AchievementBadge 
                  name="Silent Killer"
                  description="Kill 10 ads"
                  earned={(profile?.ads_killed || 0) >= 10}
                  icon="🔇"
                />
                <AchievementBadge 
                  name="Bargain Hunter"
                  description="Find 5 alternatives"
                  earned={(profile?.alternatives_found || 0) >= 5}
                  icon="💎"
                />
                <AchievementBadge 
                  name="DSA Guardian"
                  description="Report 25 violations"
                  earned={(profile?.ads_reported || 0) >= 25}
                  icon="🛡️"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tutorial */}
      <Tutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
        onComplete={() => {
          setShowCoins(true);
          setTimeout(() => setShowCoins(false), 3000);
        }}
      />
    </div>
  );
}