import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Lock, Trophy, Users, Coins, Crown, 
  Ship, Anchor, Sparkles, MessageSquare, Vote,
  Gift, Zap, Globe, Shield, ArrowRightLeft, ShoppingBag,
  MapPin, Music, Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Marketplace from '@/components/island/Marketplace';
import IslandMap from '@/components/island/IslandMap';
import Tavern from '@/components/island/Tavern';
import AnthemPlayer from '@/components/island/AnthemPlayer';

const ENTRY_THRESHOLD = 500;

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Pirate Tavern',
    description: 'Private chat for successful pirates. Share strategies, coordinate reports, plan bounties.',
    status: 'Coming Q2 2026'
  },
  {
    icon: Crown,
    title: 'King Election',
    description: 'Vote for Pirate King monthly. Kings get exclusive perks and influence platform decisions.',
    status: 'Coming Q3 2026'
  },
  {
    icon: Coins,
    title: 'Doubloon Token',
    description: 'Blockchain currency for NovaLibertalia. Earn, trade, redeem for real-world perks.',
    status: 'Whitepaper Q2 2026'
  },
  {
    icon: Gift,
    title: 'Real-World Perks',
    description: 'Exclusive discounts, pirate merch, annual meetups, and treasure hunts.',
    status: 'Launching with 1000+ members'
  },
  {
    icon: Vote,
    title: 'Governance',
    description: 'Shape AdPiratin\'s future. Vote on features, DSA enforcement priorities, partnerships.',
    status: 'DAO structure planned'
  },
  {
    icon: Shield,
    title: 'Elite Reports',
    description: 'Priority handling for your DSA reports. Direct line to EU authorities.',
    status: 'Active for 500+ pts'
  }
];

export default function NovaLibertalia() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [swapAmount, setSwapAmount] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const profile = pirateProfile?.[0];
  const currentPoints = profile?.total_points || 0;
  const progressPercent = Math.min((currentPoints / ENTRY_THRESHOLD) * 100, 100);
  const pointsNeeded = Math.max(ENTRY_THRESHOLD - currentPoints, 0);
  const hasAccess = currentPoints >= ENTRY_THRESHOLD;

  // Get Doubloons and purchases from localStorage
  const getDoubloons = () => {
    const data = localStorage.getItem('adpiratin_doubloons');
    return data ? JSON.parse(data) : { balance: 0, purchases: [] };
  };

  const getTreasury = () => {
    const treasury = localStorage.getItem('adpiratin_treasury');
    return treasury ? parseFloat(treasury) : 0;
  };

  const [doubloonsData, setDoubloonsData] = useState(getDoubloons());
  const [treasury, setTreasury] = useState(getTreasury());

  const swapMutation = useMutation({
    mutationFn: async (amount) => {
      const pointsToSwap = parseInt(amount);
      if (pointsToSwap > currentPoints) {
        throw new Error('Not enough Pirate Points!');
      }

      // 2% fee
      const fee = Math.ceil(pointsToSwap * 0.02);
      const doubloonsReceived = pointsToSwap - fee;

      // Update profile points
      await base44.entities.PirateUser.update(profile.id, {
        total_points: currentPoints - pointsToSwap
      });

      // Update doubloons
      const newData = {
        balance: doubloonsData.balance + doubloonsReceived,
        purchases: doubloonsData.purchases
      };
      localStorage.setItem('adpiratin_doubloons', JSON.stringify(newData));
      setDoubloonsData(newData);

      // Update treasury
      const newTreasury = treasury + fee;
      localStorage.setItem('adpiratin_treasury', newTreasury.toString());
      setTreasury(newTreasury);

      return { doubloonsReceived, fee };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['pirateProfile']);
      toast.success(`Swapped! Received ${data.doubloonsReceived} Doubloons (${data.fee} fee to Treasury)`);
      setSwapAmount('');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handlePurchase = (item, type) => {
    const fee = Math.ceil(item.price * 0.01); // 1% fee
    const newBalance = doubloonsData.balance - item.price;
    
    const newData = {
      balance: newBalance,
      purchases: [...doubloonsData.purchases, { ...item, type, date: Date.now() }]
    };
    localStorage.setItem('adpiratin_doubloons', JSON.stringify(newData));
    setDoubloonsData(newData);

    const newTreasury = treasury + fee;
    localStorage.setItem('adpiratin_treasury', newTreasury.toString());
    setTreasury(newTreasury);

    toast.success(`Purchased ${item.name}! (${fee} Doubloons to Treasury)`);
  };

  const handleSwap = () => {
    if (!swapAmount || parseInt(swapAmount) <= 0) {
      toast.error('Enter a valid amount!');
      return;
    }
    swapMutation.mutate(swapAmount);
  };

  const ownedVilla = doubloonsData.purchases.find(p => p.type === 'villas');
  const ownedPlots = hasAccess ? ['5-5'] : []; // Center plot if has access

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Ship className="w-7 h-7 text-[#d4af37]" />
              NovaLibertalia
            </h1>
            <p className="text-[#8ba3c7] text-sm">Your blockchain-gated pirate paradise</p>
          </div>
        </motion.div>

        {/* Hero / Entry Gate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-[#1a2d4a] via-[#1a3d5a] to-[#1a2d4a] border-[#d4af37]/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
            <CardContent className="p-8 md:p-12 relative">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block"
                >
                  <Anchor className="w-20 h-20 text-[#d4af37] mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  {hasAccess ? 'Welcome to NovaLibertalia! 🏴‍☠️' : 'Entry Gate'}
                </h2>
                <p className="text-[#c4d4e4] text-lg max-w-2xl mx-auto">
                  {hasAccess 
                    ? 'Ye have earned your place among the elite pirates! Explore the island below.'
                    : 'Earn enough Pirate Points to unlock NovaLibertalia — an exclusive community for successful pirates!'
                  }
                </p>
              </div>

              {!hasAccess && (
                <div className="max-w-md mx-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[#8ba3c7] text-sm">Your Progress</span>
                    <span className="text-white font-bold">{currentPoints} / {ENTRY_THRESHOLD} pts</span>
                  </div>
                  <Progress value={progressPercent} className="h-3 mb-3" />
                  <div className="flex items-center justify-center gap-2 p-4 bg-[#d4af37]/10 rounded-xl border border-[#d4af37]/30">
                    <Lock className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-[#d4af37] font-bold">
                      {pointsNeeded} more points needed to enter
                    </span>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-[#8ba3c7] text-sm mb-3">Quick ways to earn points:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge className="bg-red-500/20 text-red-400">Report ad +25 pts</Badge>
                      <Badge className="bg-blue-500/20 text-blue-400">Hunt deals +15 pts</Badge>
                      <Badge className="bg-green-500/20 text-green-400">Share meme +5 pts</Badge>
                    </div>
                  </div>
                </div>
              )}

              {hasAccess && (
                <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="text-center p-4 bg-[#0a1628]/50 rounded-xl border border-[#d4af37]/20">
                    <Coins className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">{doubloonsData.balance}</p>
                    <p className="text-[#5a7a9a] text-xs mt-1">Doubloons</p>
                  </div>
                  <div className="text-center p-4 bg-[#0a1628]/50 rounded-xl border border-emerald-500/20">
                    <Landmark className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">{treasury}</p>
                    <p className="text-[#5a7a9a] text-xs mt-1">Island Treasury</p>
                  </div>
                  <div className="text-center p-4 bg-[#0a1628]/50 rounded-xl border border-[#1e90ff]/20">
                    <Trophy className="w-8 h-8 text-[#1e90ff] mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">Elite</p>
                    <p className="text-[#5a7a9a] text-xs mt-1">Status</p>
                  </div>
                  <div className="text-center p-4 bg-[#0a1628]/50 rounded-xl border border-purple-500/20">
                    <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-black text-white">247</p>
                    <p className="text-[#5a7a9a] text-xs mt-1">Pirates Online</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Island Tabs (for access users) */}
        {hasAccess && (
          <div className="mb-8">
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Globe },
                { id: 'swap', label: 'Swap Points', icon: ArrowRightLeft },
                { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                { id: 'map', label: 'Island Map', icon: MapPin },
                { id: 'tavern', label: 'Tavern', icon: MessageSquare },
                { id: 'anthem', label: 'Anthem', icon: Music }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  className={activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]'
                    : 'border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a]'
                  }
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'swap' && (
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-[#d4af37]" />
                    Swap Points to Doubloons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <div className="mb-4 p-4 bg-[#0a1628]/50 rounded-xl">
                      <p className="text-[#8ba3c7] text-sm mb-2">Your Pirate Points</p>
                      <p className="text-white text-3xl font-black">{currentPoints}</p>
                    </div>
                    <div className="flex gap-3 mb-4">
                      <Input
                        type="number"
                        placeholder="Amount to swap..."
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        className="bg-[#0a1628] border-[#2a4a6a] text-white"
                      />
                      <Button
                        onClick={handleSwap}
                        disabled={swapMutation.isPending}
                        className="bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white"
                      >
                        Swap (2% fee)
                      </Button>
                    </div>
                    <div className="p-3 bg-[#1e90ff]/10 rounded-xl border border-[#1e90ff]/30">
                      <p className="text-[#1e90ff] text-sm">
                        ⚡ Ratio: 1 Point = 1 Doubloon (2% fee goes to Island Treasury)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'marketplace' && (
              <Marketplace 
                doubloonsBalance={doubloonsData.balance}
                onPurchase={handlePurchase}
              />
            )}

            {activeTab === 'map' && (
              <IslandMap 
                ownedPlots={ownedPlots}
                villaSkin={ownedVilla?.id || 'classic'}
              />
            )}

            {activeTab === 'tavern' && (
              <Tavern 
                username={profile?.pirate_name}
                userRank={profile?.rank}
              />
            )}

            {activeTab === 'anthem' && (
              <AnthemPlayer />
            )}
          </div>
        )}

        {/* Features Grid */}
        {activeTab === 'overview' && (
          <div className="mb-8">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              {hasAccess ? 'Island Features' : 'What Awaits in NovaLibertalia'}
            </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className={`bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 h-full ${
                  hasAccess && feature.status.includes('Active') ? 'border-[#d4af37]/30' : ''
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#d4af37]/10 rounded-xl shrink-0">
                        <feature.icon className="w-6 h-6 text-[#d4af37]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-white font-bold">{feature.title}</h4>
                          <Badge className="bg-[#1e90ff]/20 text-[#1e90ff] text-xs shrink-0">
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-[#8ba3c7] text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          </div>
        )}

        {/* Roadmap Teaser */}
        {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#1e90ff]" />
                NovaLibertalia Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { quarter: 'Q1 2026', milestone: 'Beta launch — First 100 pirates get founding member status', status: 'In Progress' },
                  { quarter: 'Q2 2026', milestone: 'Tavern opens — Community chat & Doubloon whitepaper released', status: 'Planned' },
                  { quarter: 'Q3 2026', milestone: 'King Election — First Pirate King crowned, governance begins', status: 'Planned' },
                  { quarter: 'Q4 2026', milestone: 'Doubloon launch — Token trading, real-world perks unlocked', status: 'Vision' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#0a1628]/30 border border-[#2a4a6a]/30">
                    <div className="shrink-0">
                      <Badge className={
                        item.status === 'In Progress' ? 'bg-green-500/20 text-green-400' :
                        item.status === 'Planned' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }>
                        {item.quarter}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.milestone}</p>
                    </div>
                    <Zap className="w-5 h-5 text-[#d4af37]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        {!hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold text-lg px-8 py-6">
                <Trophy className="w-5 h-5 mr-2" />
                Start Earning Points
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}