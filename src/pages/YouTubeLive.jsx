import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Youtube, Radio, Podcast, GraduationCap, 
  Coins, Users, Crown, ArrowLeft, Sparkles,
  Play, Bell, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const COMING_FEATURES = [
  {
    icon: Radio,
    title: 'Live Streams',
    description: 'Watch us expose bad ads in real-time. Interactive Q&A with the crew.',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: Podcast,
    title: 'Pirate Podcasts',
    description: 'Deep dives into DSA violations, consumer rights, and the fight for fair prices.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: GraduationCap,
    title: 'Pirate Academy',
    description: 'Learn to spot deception, analyze ads, and become an expert exposer.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Coins,
    title: 'Treasure Hunts',
    description: 'Community challenges to find the most outrageous violations. Big bounties!',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Crown,
    title: "King's Council",
    description: 'Monthly governance meetings where the elected King proposes new features.',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Users,
    title: 'Guest Pirates',
    description: 'Interviews with consumer advocates, lawyers, and reformed advertisers.',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function YouTubeLive() {
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
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center"
          >
            <Youtube className="w-12 h-12 text-white" />
          </motion.div>

          <Badge className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm px-4 py-1">
            Coming in v6
          </Badge>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            NovaLibertalia Live
          </h1>
          <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto">
            Your pirate TV station for exposing deception, learning truth-seeking skills, and building the movement.
          </p>
        </motion.div>

        {/* Coming Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {COMING_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shrink-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-[#8ba3c7] text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-[#d4af37]/20 to-[#b8962e]/10 border-[#d4af37]/50 overflow-hidden">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
              <h2 className="text-white font-black text-2xl mb-3">
                Be Part of the First Crew
              </h2>
              <p className="text-[#8ba3c7] mb-6 max-w-xl mx-auto">
                Subscribe now to get notified when we launch. First 1,000 subscribers get exclusive "Founding Pirate" badges and bonus Doubloons!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:opacity-90">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
                <Button variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teaser Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] flex items-center justify-center relative overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10"
                />
                <div className="relative text-center">
                  <Play className="w-20 h-20 text-white/50 mx-auto mb-4" />
                  <p className="text-white font-bold text-xl">Teaser Coming Soon</p>
                  <p className="text-[#8ba3c7] text-sm mt-2">Get ready for the pirate revolution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}