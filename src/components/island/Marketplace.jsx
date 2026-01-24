import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Home, Award, FileText, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const VILLA_SKINS = [
  { id: 'classic', name: 'Classic Galleon', price: 100, icon: '🏴‍☠️', description: 'Traditional pirate villa with black sails' },
  { id: 'gold', name: 'Golden Palace', price: 500, icon: '👑', description: 'Luxurious gold-trimmed villa for elite pirates' },
  { id: 'kraken', name: 'Kraken\'s Lair', price: 1000, icon: '🐙', description: 'Mysterious underwater-themed villa' }
];

const BADGES = [
  { id: 'founder', name: 'Founding Pirate', price: 250, icon: '⚓', description: 'Early supporter exclusive badge' },
  { id: 'hunter', name: 'Master Hunter', price: 300, icon: '🎯', description: 'Found 50+ better deals' },
  { id: 'buster', name: 'DSA Guardian', price: 400, icon: '🛡️', description: 'Reported 100+ violations' },
  { id: 'captain', name: 'Captain Rank', price: 600, icon: '⚔️', description: 'Reached captain status' },
  { id: 'legend', name: 'Legendary Pirate', price: 1500, icon: '💎', description: 'Ultimate achievement' }
];

const LICENSES = [
  { id: 'merch', name: 'Merch Creator', price: 200, icon: '👕', description: 'Unlock custom merch templates' },
  { id: 'meme', name: 'Meme Master', price: 150, icon: '🎨', description: 'Access premium meme templates' },
  { id: 'voice', name: 'Voice Pack Pro', price: 100, icon: '🎤', description: 'Additional pirate voice lines' }
];

export default function Marketplace({ doubloonsBalance, onPurchase }) {
  const [selectedTab, setSelectedTab] = useState('villas');
  const [purchasing, setPurchasing] = useState(null);
  const [showCoinRain, setShowCoinRain] = useState(false);

  const handlePurchase = async (item, type) => {
    if (doubloonsBalance < item.price) {
      toast.error('Not enough Doubloons!');
      return;
    }

    setPurchasing(item.id);
    setShowCoinRain(true);

    setTimeout(() => {
      onPurchase(item, type);
      setPurchasing(null);
      setTimeout(() => setShowCoinRain(false), 2000);
    }, 1000);
  };

  const tabs = [
    { id: 'villas', label: 'Villa Skins', icon: Home, items: VILLA_SKINS },
    { id: 'badges', label: 'Badges', icon: Award, items: BADGES },
    { id: 'licenses', label: 'Licenses', icon: FileText, items: LICENSES }
  ];

  const currentItems = tabs.find(t => t.id === selectedTab)?.items || [];

  return (
    <div className="relative">
      {/* Coin Rain Animation */}
      <AnimatePresence>
        {showCoinRain && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{ 
                  top: -50, 
                  left: `${Math.random() * 100}%`,
                  rotate: 0,
                  scale: 0.5
                }}
                animate={{ 
                  top: '110%',
                  rotate: [0, 360, 720],
                  scale: [0.5, 1.2, 0.8]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2 + Math.random() * 1,
                  delay: Math.random() * 0.3
                }}
              >
                🪙
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            variant={selectedTab === tab.id ? 'default' : 'outline'}
            className={selectedTab === tab.id 
              ? 'bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]'
              : 'border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a]'
            }
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {currentItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold mb-1">{item.name}</h4>
                    <p className="text-[#8ba3c7] text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-[#d4af37]" />
                        <span className="text-[#d4af37] font-bold">{item.price}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(item, selectedTab)}
                        disabled={purchasing === item.id || doubloonsBalance < item.price}
                        className="bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white"
                        size="sm"
                      >
                        {purchasing === item.id ? (
                          <>
                            <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                            Buying...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3 mr-1" />
                            Buy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}