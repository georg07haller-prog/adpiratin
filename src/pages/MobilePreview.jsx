import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, Home, AlertTriangle, Search, Trophy, Share2,
  ArrowLeft, Smartphone, ChevronRight, Coins, Target,
  Eye, EyeOff, Sparkles, Bell, Settings, User, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MOBILE_SCREENS = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'detect', name: 'Ad Detection', icon: Eye },
  { id: 'report', name: 'Report', icon: AlertTriangle },
  { id: 'deals', name: 'Hunt Deals', icon: Search },
  { id: 'profile', name: 'Profile', icon: User },
];

function PhoneMockup({ children, screenName }) {
  return (
    <div className="relative mx-auto" style={{ width: 320, height: 640 }}>
      {/* Phone frame */}
      <div className="absolute inset-0 bg-black rounded-[40px] shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20" />
        {/* Screen */}
        <div className="absolute inset-3 bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] rounded-[28px] overflow-hidden">
          {/* Status bar */}
          <div className="h-10 flex items-center justify-between px-6 text-white text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="h-[calc(100%-40px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-lg">
            <Skull className="w-5 h-5 text-[#0a1628]" />
          </div>
          <span className="text-white font-bold">AdPiratin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="w-8 h-8 text-[#8ba3c7]">
            <Bell className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8 text-[#8ba3c7]">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Points Card */}
      <div className="bg-gradient-to-r from-[#1a2d4a] to-[#0f2137] rounded-2xl p-4 mb-4 border border-[#d4af37]/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#8ba3c7] text-xs">Pirate Points</p>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#d4af37]" />
              <span className="text-2xl font-black text-white">1,250</span>
            </div>
          </div>
          <Badge className="bg-[#d4af37]/20 text-[#d4af37]">Crew Mate</Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#1a2d4a]/50 rounded-xl p-3 text-center">
          <EyeOff className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <p className="text-white font-bold">24</p>
          <p className="text-[#5a7a9a] text-xs">Killed</p>
        </div>
        <div className="bg-[#1a2d4a]/50 rounded-xl p-3 text-center">
          <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-white font-bold">8</p>
          <p className="text-[#5a7a9a] text-xs">Reported</p>
        </div>
        <div className="bg-[#1a2d4a]/50 rounded-xl p-3 text-center">
          <Search className="w-5 h-5 text-[#1e90ff] mx-auto mb-1" />
          <p className="text-white font-bold">15</p>
          <p className="text-[#5a7a9a] text-xs">Hunted</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-3 bg-[#1a2d4a]/50 rounded-xl">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Report Ad</p>
            <p className="text-[#5a7a9a] text-xs">+25 pts</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5a7a9a]" />
        </div>
        <div className="flex items-center gap-3 p-3 bg-[#1a2d4a]/50 rounded-xl">
          <div className="p-2 bg-[#1e90ff]/20 rounded-lg">
            <Search className="w-5 h-5 text-[#1e90ff]" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Hunt Deals</p>
            <p className="text-[#5a7a9a] text-xs">+10 pts</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5a7a9a]" />
        </div>
      </div>
    </div>
  );
}

function DetectionScreen() {
  const [scanning, setScanning] = useState(false);
  
  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-lg mb-4">Ad Detection</h2>
      
      <div className="bg-[#1a2d4a]/50 rounded-2xl p-6 text-center mb-4">
        <motion.div 
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1e90ff] to-cyan-400 flex items-center justify-center"
          animate={scanning ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: scanning ? Infinity : 0 }}
        >
          <Eye className="w-10 h-10 text-white" />
        </motion.div>
        <p className="text-white font-semibold mb-2">
          {scanning ? 'Scanning Page...' : 'Tap to Scan'}
        </p>
        <p className="text-[#8ba3c7] text-sm">
          {scanning ? 'Looking for sponsored content' : 'Detect ads on current page'}
        </p>
        <Button 
          onClick={() => setScanning(!scanning)}
          className={`mt-4 ${scanning ? 'bg-red-500' : 'bg-[#1e90ff]'}`}
        >
          {scanning ? 'Stop' : 'Start Scan'}
        </Button>
      </div>

      <h3 className="text-white font-semibold mb-3">Detected Ads (3)</h3>
      <div className="space-y-2">
        {['Zalando', 'Amazon', 'eBay'].map((brand, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#1a2d4a]/50 rounded-xl">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Target className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{brand}</p>
              <p className="text-[#5a7a9a] text-xs">Sponsored</p>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs border-[#2a4a6a] text-white">
              Action
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportScreen() {
  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-lg mb-4">Report Violation</h2>
      
      <div className="space-y-3">
        {[
          { icon: '💰', name: 'Fake Price', pts: 30 },
          { icon: '🌱', name: 'Greenwashing', pts: 35 },
          { icon: '🎭', name: 'Misleading', pts: 25 },
          { icon: '💳', name: 'Hidden Fees', pts: 30 },
        ].map((type, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-[#1a2d4a]/50 rounded-xl border border-transparent hover:border-[#d4af37]/30 transition-all">
            <span className="text-2xl">{type.icon}</span>
            <div className="flex-1">
              <p className="text-white font-medium">{type.name}</p>
            </div>
            <Badge className="bg-[#d4af37]/20 text-[#d4af37]">+{type.pts}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealsScreen() {
  return (
    <div className="p-4">
      <h2 className="text-white font-bold text-lg mb-4">Hunt Deals</h2>
      
      <div className="bg-[#1a2d4a]/50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#5a7a9a]" />
          <input 
            type="text" 
            placeholder="Search product..." 
            className="bg-transparent text-white text-sm flex-1 outline-none placeholder:text-[#5a7a9a]"
          />
        </div>
      </div>

      <h3 className="text-white font-semibold mb-3">Recent Searches</h3>
      <div className="space-y-2">
        {['Sony Headphones', 'Nike Air Max', 'MacBook Pro'].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#1a2d4a]/50 rounded-xl">
            <div className="w-10 h-10 bg-[#2a4a6a] rounded-lg" />
            <div className="flex-1">
              <p className="text-white text-sm">{item}</p>
              <p className="text-green-400 text-xs">3 cheaper alternatives</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5a7a9a]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center">
          <User className="w-10 h-10 text-[#0a1628]" />
        </div>
        <h2 className="text-white font-bold">Captain_Jack</h2>
        <Badge className="mt-1 bg-[#d4af37]/20 text-[#d4af37]">Crew Mate</Badge>
      </div>

      <div className="bg-[#1a2d4a]/50 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-[#8ba3c7]">Total Points</span>
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-[#d4af37]" />
            <span className="text-white font-bold">1,250</span>
          </div>
        </div>
      </div>

      <h3 className="text-white font-semibold mb-3">Achievements</h3>
      <div className="grid grid-cols-3 gap-2">
        {['🎯', '🔇', '💎', '🛡️', '⚔️', '🏆'].map((emoji, i) => (
          <div key={i} className={`p-3 rounded-xl text-center ${i < 3 ? 'bg-[#d4af37]/10 border border-[#d4af37]/30' : 'bg-[#1a2d4a]/30 opacity-50'}`}>
            <span className="text-2xl">{emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MobilePreview() {
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home': return <HomeScreen />;
      case 'detect': return <DetectionScreen />;
      case 'report': return <ReportScreen />;
      case 'deals': return <DealsScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

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
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-[#1e90ff]" />
              Mobile App Preview
            </h1>
            <p className="text-[#8ba3c7] text-sm">React Native Expo mockup</p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <PhoneMockup screenName={activeScreen}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderScreen()}
                </motion.div>
              </AnimatePresence>
              
              {/* Bottom Nav */}
              <div className="absolute bottom-6 left-3 right-3 bg-[#0d1a2d]/95 backdrop-blur-xl rounded-2xl p-2 flex justify-around">
                {MOBILE_SCREENS.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => setActiveScreen(screen.id)}
                    className={`p-2 rounded-xl transition-all ${
                      activeScreen === screen.id 
                        ? 'bg-[#d4af37]/20 text-[#d4af37]' 
                        : 'text-[#5a7a9a]'
                    }`}
                  >
                    <screen.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </PhoneMockup>
          </motion.div>

          {/* Info Panel */}
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 max-w-md">
            <CardContent className="p-6">
              <h3 className="text-white font-bold text-lg mb-4">Mobile Companion App</h3>
              <p className="text-[#8ba3c7] text-sm mb-4">
                The AdPiratin mobile app brings ad-busting to your pocket. Built with React Native Expo 
                for iOS and Android.
              </p>
              
              <h4 className="text-white font-semibold mb-2">Key Features:</h4>
              <ul className="space-y-2 text-[#8ba3c7] text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Real-time ad detection in mobile browsers
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Quick report submission with camera
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Push notifications for bounty alerts
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Offline mode for point tracking
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Barcode scanner for in-store deals
                </li>
              </ul>

              <div className="mt-6 p-4 bg-[#0a1628]/50 rounded-xl">
                <p className="text-[#5a7a9a] text-xs mb-2">Tech Stack:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#1e90ff]/20 text-[#1e90ff]">React Native</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400">Expo</Badge>
                  <Badge className="bg-green-500/20 text-green-400">TypeScript</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}