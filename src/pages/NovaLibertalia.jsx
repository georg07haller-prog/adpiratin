import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Radio, GraduationCap, TrendingUp, Crown, Sparkles, PlayCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UPCOMING_CONTENT = [
  { 
    title: 'Live Streams', 
    icon: Radio, 
    description: 'Weekly live ad-busting sessions with the community',
    color: 'from-red-500 to-pink-500'
  },
  { 
    title: 'Podcasts', 
    icon: Youtube, 
    description: 'Deep dives into DSA violations and consumer rights',
    color: 'from-purple-500 to-indigo-500'
  },
  { 
    title: 'Pirate Academy', 
    icon: GraduationCap, 
    description: 'Master classes on spotting deceptive ads and dark patterns',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    title: 'Treasure Hunts', 
    icon: TrendingUp, 
    description: 'Community challenges to find the best deals and worst ads',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    title: "King's Council", 
    icon: Crown, 
    description: 'Monthly town halls with top pirates and special guests',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function NovaLibertalia() {
  const [notifyMe, setNotifyMe] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-bold">COMING SOON</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Youtube className="w-12 h-12 text-red-500" />
            NovaLibertalia Live
          </h1>
          
          <p className="text-xl text-[#8ba3c7] max-w-2xl mx-auto mb-6">
            Your headquarters for live pirate content, education, and community events
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Badge className="bg-[#d4af37]/20 text-[#d4af37] text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              100% Free
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 text-lg px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Pirate Exclusive
            </Badge>
          </div>

          {!notifyMe ? (
            <Button
              onClick={() => setNotifyMe(true)}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg px-8 py-6 h-auto"
            >
              <Bell className="w-5 h-5 mr-2" />
              Notify Me at Launch
            </Button>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-xl"
            >
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-green-400 font-bold">You'll be notified at launch! 🎉</span>
            </motion.div>
          )}
        </motion.div>

        {/* Preview Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
              
              <div className="relative text-center z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4"
                >
                  <PlayCircle className="w-24 h-24 text-red-500 mx-auto" />
                </motion.div>
                <p className="text-white text-xl font-bold mb-2">Channel Preview</p>
                <p className="text-[#8ba3c7]">First episode drops soon!</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Upcoming Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What's Coming</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {UPCOMING_CONTENT.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-3`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#8ba3c7] text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-[#d4af37]/10 to-[#1e90ff]/10 backdrop-blur-xl border-[#d4af37]/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join the Pirate Movement
              </h3>
              <p className="text-[#8ba3c7] mb-6 max-w-2xl mx-auto">
                Be part of the first crew to sail the seas of NovaLibertalia. 
                Premium content, exclusive access, and a community fighting deception together.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold"
                >
                  Subscribe on YouTube (Soon)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a]"
                >
                  Join Discord Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}