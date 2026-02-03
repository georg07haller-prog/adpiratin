import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Trophy, ArrowLeft, Crown, Medal, Coins, Target,
  AlertTriangle, Search, Anchor, Ship, Skull, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RANK_ICONS = {
  'Deck Swabber': Anchor,
  'Crew Mate': Ship,
  'Sly Sniper': Target,
  'Captains Cutlass': Skull,
  'Treasure Hunter': Coins,
  'Golden Galleon': Crown
};

export default function Leaderboard() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: allPirates } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => base44.entities.PirateUser.list('-total_points', 10)
  });

  const { data: currentUserProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const pirates = allPirates || [];
  const myProfile = currentUserProfile?.[0];
  const myRank = pirates.findIndex(p => p.id === myProfile?.id) + 1;
  const topThree = pirates.slice(0, 3);

  const handleRefresh = async () => {
    await queryClient.invalidateQueries(['leaderboard']);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">🏆 Top 10 Pirates</h1>
            <p className="text-[#8ba3c7] text-sm">Hall of Fame - Most Points Earned</p>
          </div>
        </motion.div>

        {myProfile && myRank > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-r from-[#d4af37]/20 via-[#1a2d4a]/50 to-[#0f2137]/50 backdrop-blur-xl border-[#d4af37]/50 mb-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl" />
              <CardContent className="p-5 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center font-black text-xl text-[#0a1628] shadow-lg">#{myRank}</div>
                      <motion.div className="absolute -top-1 -right-1 w-6 h-6 bg-[#1e90ff] rounded-full flex items-center justify-center" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Sparkles className="w-3 h-3 text-white" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{myProfile.pirate_name}</p>
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] mt-1">Your Rank</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-3xl font-black">{myProfile.total_points?.toLocaleString() || 0}</p>
                    <p className="text-[#8ba3c7] text-sm">points earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-[#d4af37] font-black text-2xl mb-1">⚓ Hall of Fame ⚓</h2>
          <p className="text-[#8ba3c7] text-sm">The Legendary Three</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-end justify-center gap-4 mb-8">
            {topThree[1] && (
              <motion.div className="flex-1 max-w-[140px]" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="bg-[#1a2d4a]/50 backdrop-blur-xl border border-[#2a4a6a]/50 rounded-t-xl p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                    <Medal className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm truncate">{topThree[1].pirate_name}</p>
                  <p className="text-[#d4af37] font-bold">{topThree[1].total_points?.toLocaleString()}</p>
                </div>
                <div className="h-20 bg-gradient-to-b from-gray-400/20 to-gray-600/20 rounded-b-xl flex items-center justify-center">
                  <span className="text-4xl font-black text-gray-400">2</span>
                </div>
              </motion.div>
            )}

            {topThree[0] && (
              <motion.div className="flex-1 max-w-[160px]" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="bg-gradient-to-b from-[#d4af37]/20 to-[#d4af37]/5 backdrop-blur-xl border border-[#d4af37]/30 rounded-t-xl p-5 text-center relative">
                  <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Crown className="w-8 h-8 text-[#d4af37]" />
                  </motion.div>
                  <div className="w-16 h-16 mx-auto mb-2 mt-2 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-bold truncate">{topThree[0].pirate_name}</p>
                  <p className="text-[#d4af37] font-black text-lg">{topThree[0].total_points?.toLocaleString()}</p>
                </div>
                <div className="h-28 bg-gradient-to-b from-[#d4af37]/20 to-[#d4af37]/5 rounded-b-xl flex items-center justify-center">
                  <span className="text-5xl font-black text-[#d4af37]">1</span>
                </div>
              </motion.div>
            )}

            {topThree[2] && (
              <motion.div className="flex-1 max-w-[140px]" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <div className="bg-[#1a2d4a]/50 backdrop-blur-xl border border-[#2a4a6a]/50 rounded-t-xl p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                    <Medal className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-white font-bold text-sm truncate">{topThree[2].pirate_name}</p>
                  <p className="text-[#d4af37] font-bold">{topThree[2].total_points?.toLocaleString()}</p>
                </div>
                <div className="h-16 bg-gradient-to-b from-amber-600/20 to-amber-800/20 rounded-b-xl flex items-center justify-center">
                  <span className="text-4xl font-black text-amber-600">3</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Rankings 4-10</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pirates.slice(3, 10).map((pirate, i) => {
              const RankIcon = RANK_ICONS[pirate.rank] || Anchor;
              const position = i + 4;
              return (
                <motion.div key={pirate.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + (i * 0.05) }} className={`flex items-center gap-4 p-3 rounded-xl transition-all ${pirate.id === myProfile?.id ? 'bg-[#d4af37]/10 border border-[#d4af37]/30' : 'bg-[#0a1628]/50 border border-transparent hover:border-[#2a4a6a]/50'}`}>
                  <div className="w-8 text-center">
                    <span className="font-bold text-[#d4af37]">#{position}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a4a6a] to-[#1a2d4a] flex items-center justify-center">
                    <RankIcon className="w-5 h-5 text-[#8ba3c7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{pirate.pirate_name}</p>
                    <Badge className="bg-[#1a2d4a] text-[#8ba3c7] text-xs border-[#2a4a6a] mt-1">{pirate.rank || 'Deck Swabber'}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-[#d4af37]" />
                      <span className="text-white font-bold">{pirate.total_points?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5a7a9a] mt-1">
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{pirate.ads_reported || 0}</span>
                      <span className="flex items-center gap-1"><Search className="w-3 h-3" />{pirate.alternatives_found || 0}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
    </PullToRefresh>
  );
}