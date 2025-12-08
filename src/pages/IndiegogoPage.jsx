import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Skull, Coins, Target, Shield, Users, 
  Sparkles, ChevronRight, Check, AlertTriangle,
  Smartphone, Chrome, Gift, Heart, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PERKS = [
  {
    name: 'Deck Swabber',
    price: 5,
    description: 'Early bird access + name in credits',
    features: ['Early access to beta', 'Name in app credits', 'Deck Swabber badge'],
    icon: '⚓',
    color: 'from-blue-500 to-cyan-500',
    claimed: 234,
    limit: 500
  },
  {
    name: 'Crew Mate',
    price: 15,
    description: 'All basics + exclusive sticker pack',
    features: ['Everything in Deck Swabber', 'Digital sticker pack', '500 bonus points', 'Priority support'],
    icon: '🚢',
    color: 'from-purple-500 to-pink-500',
    claimed: 156,
    limit: 300
  },
  {
    name: 'Sly Sniper',
    price: 35,
    description: 'Premium tier + physical merch',
    features: ['Everything in Crew Mate', 'Physical pirate t-shirt', '1000 bonus points', 'Exclusive Discord role'],
    icon: '🎯',
    color: 'from-orange-500 to-red-500',
    claimed: 89,
    limit: 200
  },
  {
    name: 'Captain\'s Cutlass',
    price: 75,
    description: 'VIP access + lifetime premium',
    features: ['Everything in Sly Sniper', 'Lifetime premium features', 'Custom pirate name', 'Monthly bounty calls'],
    icon: '⚔️',
    color: 'from-[#d4af37] to-yellow-500',
    claimed: 42,
    limit: 100
  },
  {
    name: 'Treasure Hunter',
    price: 150,
    description: 'Founding member package',
    features: ['Everything in Captain\'s Cutlass', 'Your ad featured in app', 'Founding member NFT', 'Annual pirate dinner invite'],
    icon: '💎',
    color: 'from-emerald-500 to-teal-500',
    claimed: 18,
    limit: 50
  },
  {
    name: 'Golden Galleon',
    price: 500,
    description: 'Ultimate supporter tier',
    features: ['Everything above', 'Become an advisor', 'Revenue share option', 'Private pirate island retreat'],
    icon: '👑',
    color: 'from-[#d4af37] via-yellow-400 to-[#d4af37]',
    claimed: 3,
    limit: 10
  }
];

const FAQS = [
  {
    q: 'Is AdPiratin legal?',
    a: 'Absolutely! We help enforce existing EU DSA 2025 regulations. Users are reporting violations, not hacking or bypassing anything.'
  },
  {
    q: 'When will the extension launch?',
    a: 'Beta launches Q2 2025, with full release planned for Q3 2025. Backers get early access.'
  },
  {
    q: 'How do Pirate Points work?',
    a: 'Points are earned by reporting ads, finding alternatives, and community activities. They unlock ranks and perks within the app.'
  },
  {
    q: 'Is my data safe?',
    a: 'Yes! All reports are anonymized. We\'re GDPR-compliant with EU servers only. We never sell user data.'
  },
  {
    q: 'Can advertisers see who reported them?',
    a: 'Never. Reports are aggregated and anonymized before being shared with authorities.'
  }
];

const RISKS = [
  {
    title: 'Development Delays',
    description: 'Software development can face unexpected challenges. We\'ve built in buffer time and will communicate openly about any delays.',
    mitigation: 'Experienced team, agile methodology, regular updates'
  },
  {
    title: 'Regulatory Changes',
    description: 'DSA enforcement may evolve. We\'re designed to adapt to regulatory changes.',
    mitigation: 'Legal advisors, flexible architecture, EU partnerships'
  },
  {
    title: 'Platform Restrictions',
    description: 'Browser stores may change policies. We support multiple browsers and have backup distribution.',
    mitigation: 'Multi-platform support, direct download option'
  }
];

export default function IndiegogoPage() {
  const totalRaised = 47850;
  const goal = 75000;
  const percentFunded = (totalRaised / goal) * 100;
  const backers = 542;
  const daysLeft = 23;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-2xl">
                <Skull className="w-10 h-10 text-[#0a1628]" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              AdPiratin
            </h1>
            <p className="text-xl md:text-2xl text-[#d4af37] font-bold mb-6">
              Arrr you ready to plunder overpriced ads? 🏴‍☠️
            </p>
            <p className="text-[#c4d4e4] text-lg max-w-2xl mx-auto mb-8">
              The cheeky browser extension that fights misleading ads using EU DSA 2025 rules. 
              Find better deals, bust fake discounts, earn rewards. Fair winds, fair prices!
            </p>
            
            {/* Funding Progress */}
            <div className="max-w-xl mx-auto bg-[#1a2d4a]/50 backdrop-blur-xl rounded-2xl p-6 border border-[#d4af37]/30">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#8ba3c7]">Raised</span>
                <span className="text-[#8ba3c7]">{percentFunded.toFixed(0)}% of €{goal.toLocaleString()}</span>
              </div>
              <Progress value={percentFunded} className="h-3 mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-black text-[#d4af37]">€{totalRaised.toLocaleString()}</p>
                  <p className="text-[#5a7a9a] text-xs">Raised</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{backers}</p>
                  <p className="text-[#5a7a9a] text-xs">Backers</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{daysLeft}</p>
                  <p className="text-[#5a7a9a] text-xs">Days Left</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Why AdPiratin?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Smart Detection', desc: 'AI-powered ad detection that spots sponsored content, fake discounts, and dark patterns' },
              { icon: Shield, title: 'DSA Enforcement', desc: 'Report violations directly to EU authorities. Make advertisers accountable.' },
              { icon: Coins, title: 'Earn Rewards', desc: 'Pirate Points for every action. Climb the ranks, unlock perks, join the bounty leaderboard.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 h-full hover:border-[#d4af37]/30 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-[#d4af37]" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-[#8ba3c7] text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 bg-[#0d1a2d]/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-4">
            Choose Your Perk 🎁
          </h2>
          <p className="text-[#8ba3c7] text-center mb-12 max-w-2xl mx-auto">
            Every perk supports the mission and gets you exclusive rewards. The higher you go, the more pirate glory awaits!
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 h-full hover:border-[#d4af37]/30 transition-all overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${perk.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-3xl">{perk.icon}</span>
                        <h3 className="text-white font-bold text-lg mt-2">{perk.name}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-[#d4af37]">€{perk.price}</p>
                      </div>
                    </div>
                    <p className="text-[#8ba3c7] text-sm mb-4">{perk.description}</p>
                    <ul className="space-y-2 mb-4">
                      {perk.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm text-[#c4d4e4]">
                          <Check className="w-4 h-4 text-green-400 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-[#2a4a6a]">
                      <div className="flex justify-between text-xs text-[#5a7a9a] mb-2">
                        <span>{perk.claimed} claimed</span>
                        <span>{perk.limit - perk.claimed} left</span>
                      </div>
                      <Progress value={(perk.claimed / perk.limit) * 100} className="h-1.5 mb-3" />
                      <Button className={`w-full bg-gradient-to-r ${perk.color} text-white font-bold`}>
                        Select This Perk
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Available Everywhere
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Chrome className="w-10 h-10 text-[#1e90ff]" />
                  <div>
                    <h3 className="text-white font-bold text-lg">Browser Extension</h3>
                    <p className="text-[#5a7a9a] text-sm">Chrome, Firefox, Edge</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {['Manifest V3 compliant', 'uBlock-style ad hiding', 'One-click reporting', 'Real-time detection'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#8ba3c7] text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Smartphone className="w-10 h-10 text-purple-400" />
                  <div>
                    <h3 className="text-white font-bold text-lg">Mobile Companion</h3>
                    <p className="text-[#5a7a9a] text-sm">iOS & Android</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {['React Native Expo', 'Barcode scanner', 'Push notifications', 'Offline mode'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#8ba3c7] text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-[#0d1a2d]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <Card key={i} className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
                <CardContent className="p-6">
                  <h3 className="text-white font-bold mb-2">{faq.q}</h3>
                  <p className="text-[#8ba3c7] text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risks */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-4">
            Risks & Challenges
          </h2>
          <p className="text-[#8ba3c7] text-center mb-12">
            We believe in transparency. Here's what could go wrong and how we're prepared.
          </p>
          <div className="space-y-4">
            {RISKS.map((risk, i) => (
              <Card key={i} className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-bold mb-2">{risk.title}</h3>
                      <p className="text-[#8ba3c7] text-sm mb-2">{risk.description}</p>
                      <Badge className="bg-green-500/20 text-green-400">
                        Mitigation: {risk.mitigation}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Join the Crew! 🏴‍☠️
          </h2>
          <p className="text-[#c4d4e4] text-lg mb-8">
            Back AdPiratin today and help build a fairer internet for all EU consumers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold text-lg px-8 py-6">
              <Heart className="w-5 h-5 mr-2" />
              Back This Project
            </Button>
            <Link to={createPageUrl('Dashboard')}>
              <Button variant="outline" className="border-[#2a4a6a] text-white hover:bg-[#1a2d4a] text-lg px-8 py-6">
                Try the Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a] py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Skull className="w-6 h-6 text-[#d4af37]" />
            <span className="text-white font-bold">AdPiratin</span>
          </div>
          <p className="text-[#5a7a9a] text-sm">
            © 2025 AdPiratin. Made with ❤️ in Berlin. Fair winds, fair prices!
          </p>
        </div>
      </footer>
    </div>
  );
}