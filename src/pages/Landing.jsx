import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  Skull, ArrowRight, Shield, Target, Coins, Users, 
  Eye, AlertTriangle, Search, Trophy, Sparkles, 
  Chrome, Smartphone, Check, Star, TrendingDown,
  Heart, Zap, Globe, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    icon: Eye,
    title: 'Smart Ad Detection',
    description: 'AI-powered detection of sponsored content, fake discounts, and dark patterns across all your favorite sites',
    color: 'from-[#1e90ff] to-cyan-400'
  },
  {
    icon: Shield,
    title: 'DSA 2025 Enforcement',
    description: 'Report violations directly to EU authorities. Help enforce consumer protection laws and make advertisers accountable',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Search,
    title: 'Hunt Better Deals',
    description: 'Find cheaper alternatives instantly. Compare prices across EU retailers and save money on every purchase',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Coins,
    title: 'Earn Rewards',
    description: 'Get Pirate Points for every action. Climb ranks from Deck Swabber to Golden Galleon. Join the bounty leaderboard',
    color: 'from-[#d4af37] to-yellow-500'
  }
];

const STATS = [
  { value: '10,000+', label: 'Ads Busted', icon: Target },
  { value: '€2.5M', label: 'Saved for Users', icon: TrendingDown },
  { value: '5,420', label: 'Active Pirates', icon: Users },
  { value: '94%', label: 'Success Rate', icon: Star }
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Install Extension',
    description: 'Add AdPiratin to Chrome, Firefox, or Edge in seconds. Free and open source.',
    icon: Chrome
  },
  {
    step: '2',
    title: 'Browse Normally',
    description: 'Shop online as usual. AdPiratin works silently in the background.',
    icon: Eye
  },
  {
    step: '3',
    title: 'Take Action',
    description: 'When we detect a shady ad, choose: Hunt alternatives, Kill it, or Report (BUSTED!)',
    icon: Zap
  },
  {
    step: '4',
    title: 'Earn & Rise',
    description: 'Collect Pirate Points, unlock achievements, and climb the global leaderboard.',
    icon: Trophy
  }
];

export default function Landing() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-10 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#1e90ff]/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2d4a]/50 backdrop-blur-xl border border-[#d4af37]/30 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#d4af37] text-sm font-medium">Now Supporting EU DSA 2025</span>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="p-4 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-3xl">
                <Skull className="w-12 h-12 md:w-16 md:h-16 text-[#0a1628]" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
            >
              Arrr You Ready to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#ffd700]">
                Plunder Overpriced Ads?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-[#c4d4e4] mb-8 max-w-3xl mx-auto"
            >
              The cheeky browser extension that fights misleading ads using EU DSA 2025 rules.
              Find better deals, bust fake discounts, earn rewards. <strong className="text-[#d4af37]">Fair winds, fair prices!</strong>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold text-lg px-8 py-6 hover:opacity-90">
                  <Skull className="w-5 h-5 mr-2" />
                  Start Hunting Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('ExtensionDemo')}>
                <Button variant="outline" className="border-2 border-[#2a4a6a] text-white hover:bg-[#1a2d4a] text-lg px-8 py-6">
                  <Eye className="w-5 h-5 mr-2" />
                  See How It Works
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 text-[#8ba3c7] text-sm"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1e90ff]" />
                <span>EU Servers Only</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#d4af37]" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>5,000+ Pirates</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#d4af37]/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-[#1a2d4a] bg-[#0d1a2d]/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-[#d4af37]" />
                </div>
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-[#8ba3c7] text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Why Join the Crew?
            </h2>
            <p className="text-[#8ba3c7] text-lg max-w-2xl mx-auto">
              AdPiratin isn't just an ad blocker—it's a movement for fair advertising and consumer rights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 h-full hover:border-[#d4af37]/30 transition-all group overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${feature.color}`} />
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-[#8ba3c7] leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#0d1a2d]/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              How It Works
            </h2>
            <p className="text-[#8ba3c7] text-lg">
              Four simple steps to become an ad-busting pirate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#d4af37]/50 to-transparent" />
                )}
                
                <div className="bg-[#1a2d4a]/50 backdrop-blur-xl border border-[#2a4a6a]/50 rounded-2xl p-6 text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center font-black text-2xl text-[#0a1628]">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-[#d4af37] mx-auto mb-3" />
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#8ba3c7] text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-[#1a2d4a] via-[#1a3d5a] to-[#1a2d4a] border-[#d4af37]/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
              <CardContent className="p-12 text-center relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-2xl flex items-center justify-center">
                  <Skull className="w-8 h-8 text-[#0a1628]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Ready to Set Sail?
                </h2>
                <p className="text-[#c4d4e4] text-lg mb-8 max-w-2xl mx-auto">
                  Join 5,000+ pirates fighting for fair prices and honest advertising across Europe
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to={createPageUrl('Dashboard')}>
                    <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold text-lg px-8 py-6 hover:opacity-90">
                      <Heart className="w-5 h-5 mr-2" />
                      Join the Crew — Free!
                    </Button>
                  </Link>
                  <Link to={createPageUrl('IndiegogoPage')}>
                    <Button variant="outline" className="border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 text-lg px-8 py-6">
                      Support on Indiegogo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a] py-12 px-4 bg-[#0d1a2d]/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Skull className="w-6 h-6 text-[#d4af37]" />
                <span className="text-white font-bold text-lg">AdPiratin</span>
              </div>
              <p className="text-[#5a7a9a] text-sm">
                Fair winds, fair prices!
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2">
                {['Extension Demo', 'Mobile App', 'DSA Guide', 'Leaderboard'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#8ba3c7] hover:text-[#d4af37] text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Community</h4>
              <ul className="space-y-2">
                {['Discord', 'Twitter/X', 'Reddit', 'GitHub'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#8ba3c7] hover:text-[#d4af37] text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'GDPR', 'DSA Compliance'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#8ba3c7] hover:text-[#d4af37] text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1a2d4a] pt-8 text-center">
            <p className="text-[#5a7a9a] text-sm">
              © 2025 AdPiratin. Made with ❤️ in Berlin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}