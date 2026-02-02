import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Building2, Scale, TrendingUp, Users, 
  Heart, AlertTriangle, Coins 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DECEPTION_CATEGORIES = [
  { 
    id: 'advertising', 
    label: 'Advertising & Prices', 
    icon: Home, 
    color: 'from-red-500 to-orange-500',
    bounty: 25,
    description: 'Fake discounts, inflated prices, misleading claims'
  },
  { 
    id: 'real_estate', 
    label: 'Real Estate', 
    icon: Building2, 
    color: 'from-purple-500 to-pink-500',
    bounty: 50,
    description: 'Hidden defects, realtor scams, false valuations'
  },
  { 
    id: 'legal_services', 
    label: 'Legal Services', 
    icon: Scale, 
    color: 'from-blue-500 to-cyan-500',
    bounty: 40,
    description: 'False guarantees, hidden fees, misleading advice'
  },
  { 
    id: 'financial_schemes', 
    label: 'Financial / Crypto', 
    icon: TrendingUp, 
    color: 'from-yellow-500 to-green-500',
    bounty: 60,
    description: 'Ponzi schemes, fake investments, pump & dump'
  },
  { 
    id: 'political_manipulation', 
    label: 'Political Manipulation', 
    icon: Users, 
    color: 'from-indigo-500 to-purple-500',
    bounty: 35,
    description: 'False promises, propaganda, astroturfing'
  },
  { 
    id: 'health_scams', 
    label: 'Health & Wellness', 
    icon: Heart, 
    color: 'from-pink-500 to-red-500',
    bounty: 55,
    description: 'Miracle cures, fake supplements, medical fraud'
  },
  { 
    id: 'other', 
    label: 'Other Deception', 
    icon: AlertTriangle, 
    color: 'from-gray-500 to-slate-500',
    bounty: 30,
    description: 'Any other form of manipulation or fraud'
  }
];

export default function CategorySelector({ selectedCategory, onSelect }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-bold text-lg mb-2">Choose Deception Category</h3>
        <p className="text-[#8ba3c7] text-sm">What type of lie are we busting?</p>
      </div>

      <div className="grid gap-3">
        {DECEPTION_CATEGORIES.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              className={`cursor-pointer transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#d4af37]/10 border-[#d4af37]/50'
                  : 'bg-[#0a1628]/50 border-[#2a4a6a]/30 hover:border-[#d4af37]/30'
              }`}
              onClick={() => onSelect(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-semibold">{category.label}</h4>
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] text-xs">
                        <Coins className="w-3 h-3 mr-1" />
                        +{category.bounty}
                      </Badge>
                    </div>
                    <p className="text-[#8ba3c7] text-sm">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Coins className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
          <div>
            <p className="text-[#d4af37] text-sm font-semibold mb-1">Truth Bounty System</p>
            <p className="text-[#c4d4e4] text-sm">Higher bounties for more serious deceptions. Top exposés earn real €€€ from the Island Treasury!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DECEPTION_CATEGORIES };