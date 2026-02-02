import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flag, Users, Trophy, Plus, Crown, Swords,
  TrendingUp, Award, ArrowLeft, Sparkles, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const FLAG_EMOJIS = ['🏴‍☠️', '⚔️', '💀', '👑', '⚓', '🔱', '🗡️', '🏴', '🚩', '🎯'];
const FLAG_GRADIENTS = [
  'from-red-500 to-orange-500',
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500'
];

export default function Clans() {
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    motto: '',
    flag_emoji: '🏴‍☠️',
    flag_colors: 'from-red-500 to-orange-500'
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: clans = [] } = useQuery({
    queryKey: ['clans'],
    queryFn: () => base44.entities.Clan.list('-total_points', 50)
  });

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: userClan } = useQuery({
    queryKey: ['userClan', user?.email],
    queryFn: async () => {
      const userClans = await base44.entities.Clan.filter({ members: user?.email });
      return userClans[0] || null;
    },
    enabled: !!user?.email
  });

  const createClanMutation = useMutation({
    mutationFn: (data) => base44.entities.Clan.create({
      ...data,
      leader_email: user?.email,
      members: [user?.email],
      total_exposes: 0,
      total_points: 0,
      achievements: []
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clans']);
      queryClient.invalidateQueries(['userClan']);
      setShowCreate(false);
      setFormData({ name: '', motto: '', flag_emoji: '🏴‍☠️', flag_colors: 'from-red-500 to-orange-500' });
    }
  });

  const joinClanMutation = useMutation({
    mutationFn: async (clanId) => {
      const clan = clans.find(c => c.id === clanId);
      await base44.entities.Clan.update(clanId, {
        members: [...(clan.members || []), user?.email],
        total_points: (clan.total_points || 0) + (pirateProfile?.[0]?.total_points || 0)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clans']);
      queryClient.invalidateQueries(['userClan']);
    }
  });

  const leaveClanMutation = useMutation({
    mutationFn: async () => {
      if (!userClan) return;
      await base44.entities.Clan.update(userClan.id, {
        members: userClan.members.filter(m => m !== user?.email)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clans']);
      queryClient.invalidateQueries(['userClan']);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Flag className="w-8 h-8 text-[#d4af37]" />
              Pirate Clans
            </h1>
            <p className="text-[#8ba3c7]">Unite with fellow truth seekers. Compete. Dominate.</p>
          </div>
          {!userClan && (
            <Button 
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Clan
            </Button>
          )}
        </motion.div>

        {/* User's Clan */}
        {userClan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-[#d4af37]/20 to-[#b8962e]/10 border-[#d4af37]/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${userClan.flag_colors} flex items-center justify-center text-4xl`}>
                      {userClan.flag_emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-black text-xl">{userClan.name}</h3>
                        {userClan.leader_email === user?.email && (
                          <Badge className="bg-[#d4af37] text-[#0a1628]">
                            <Crown className="w-3 h-3 mr-1" />
                            Leader
                          </Badge>
                        )}
                      </div>
                      <p className="text-[#8ba3c7] italic">"{userClan.motto}"</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-[#8ba3c7]" />
                          <span className="text-white font-semibold">{userClan.members?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-[#8ba3c7]" />
                          <span className="text-white font-semibold">{userClan.total_exposes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-[#d4af37]" />
                          <span className="text-[#d4af37] font-bold">{userClan.total_points?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {userClan.leader_email !== user?.email && (
                    <Button
                      onClick={() => leaveClanMutation.mutate()}
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Leave Clan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Create Clan Modal */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreate(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
              >
                <Card className="bg-[#1a2d4a] border-[#2a4a6a]">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Flag className="w-5 h-5 text-[#d4af37]" />
                      Create Your Clan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-[#8ba3c7]">Clan Name</Label>
                      <Input
                        placeholder="The Fearless Exposers"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-[#8ba3c7]">Clan Motto</Label>
                      <Textarea
                        placeholder="Truth above all. Deception gets no mercy."
                        value={formData.motto}
                        onChange={(e) => setFormData(prev => ({ ...prev, motto: e.target.value }))}
                        className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-[#8ba3c7]">Flag Emoji</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {FLAG_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => setFormData(prev => ({ ...prev, flag_emoji: emoji }))}
                            className={`text-3xl p-3 rounded-lg transition-all ${
                              formData.flag_emoji === emoji
                                ? 'bg-[#d4af37]/20 border-2 border-[#d4af37]'
                                : 'bg-[#0a1628] border-2 border-[#2a4a6a] hover:border-[#d4af37]/50'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-[#8ba3c7]">Flag Colors</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {FLAG_GRADIENTS.map((gradient) => (
                          <button
                            key={gradient}
                            onClick={() => setFormData(prev => ({ ...prev, flag_colors: gradient }))}
                            className={`h-12 rounded-lg bg-gradient-to-r ${gradient} transition-all ${
                              formData.flag_colors === gradient
                                ? 'ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#1a2d4a]'
                                : 'hover:scale-105'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setShowCreate(false)}
                        className="text-[#8ba3c7] hover:text-white hover:bg-[#0a1628]"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => createClanMutation.mutate(formData)}
                        disabled={!formData.name || !formData.motto || createClanMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                      >
                        {createClanMutation.isPending ? 'Creating...' : 'Create Clan'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clans Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#d4af37]" />
                Clans Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clans.map((clan, i) => (
                  <motion.div
                    key={clan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="bg-[#0a1628]/50 border-[#2a4a6a]/30 hover:border-[#d4af37]/30 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 text-lg font-bold text-[#8ba3c7]">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </div>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${clan.flag_colors} flex items-center justify-center text-2xl`}>
                              {clan.flag_emoji}
                            </div>
                            <div>
                              <h3 className="text-white font-bold">{clan.name}</h3>
                              <p className="text-[#8ba3c7] text-sm italic">"{clan.motto}"</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#8ba3c7]" />
                                <span className="text-white font-semibold">{clan.members?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-[#d4af37]" />
                                <span className="text-[#d4af37] font-bold">{clan.total_points?.toLocaleString() || 0}</span>
                              </div>
                            </div>
                            {!userClan && (
                              <Button
                                onClick={() => joinClanMutation.mutate(clan.id)}
                                size="sm"
                                className="bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white hover:opacity-90"
                              >
                                Join
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {clans.length === 0 && (
                  <div className="text-center py-12">
                    <Flag className="w-16 h-16 text-[#5a7a9a] mx-auto mb-4" />
                    <p className="text-[#8ba3c7]">No clans yet. Be the first to create one!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}