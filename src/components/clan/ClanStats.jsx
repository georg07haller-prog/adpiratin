import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, TrendingUp, Award, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ClanStats({ clan }) {
  const achievements = clan.achievements || [];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <Card className="bg-gradient-to-r from-[#1a2d4a]/80 to-[#0f2137]/80 backdrop-blur-xl border-[#d4af37]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#d4af37]" />
            Clan Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[#0a1628]/30 rounded-xl">
              <Users className="w-8 h-8 text-[#8ba3c7] mx-auto mb-2" />
              <p className="text-3xl font-black text-white mb-1">{clan.members?.length || 0}</p>
              <p className="text-[#8ba3c7] text-sm">Active Members</p>
            </div>
            <div className="text-center p-4 bg-[#0a1628]/30 rounded-xl">
              <Target className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white mb-1">{clan.total_exposes || 0}</p>
              <p className="text-[#8ba3c7] text-sm">Total Exposés</p>
            </div>
            <div className="text-center p-4 bg-[#0a1628]/30 rounded-xl">
              <Trophy className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <p className="text-3xl font-black text-[#d4af37] mb-1">{clan.total_points?.toLocaleString() || 0}</p>
              <p className="text-[#8ba3c7] text-sm">Total Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1e90ff]" />
            Clan Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-gradient-to-r from-[#d4af37]/10 to-[#b8962e]/5 rounded-xl border border-[#d4af37]/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#0a1628]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{achievement.name}</h4>
                      <p className="text-[#8ba3c7] text-xs">
                        {new Date(achievement.earned_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-[#5a7a9a] mx-auto mb-3" />
              <p className="text-[#8ba3c7]">No achievements unlocked yet</p>
              <p className="text-[#5a7a9a] text-sm mt-1">Keep busting ads to earn clan achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Position */}
      <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Leaderboard Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-[#0a1628]/30 rounded-xl">
            <div>
              <p className="text-[#8ba3c7] text-sm mb-1">Current Rank</p>
              <p className="text-white font-bold text-2xl">#TBD</p>
            </div>
            <Crown className="w-12 h-12 text-[#d4af37]" />
          </div>
          <p className="text-[#8ba3c7] text-sm mt-4 text-center">
            Compete with other clans to reach the top of the leaderboard!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}