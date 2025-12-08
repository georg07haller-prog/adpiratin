import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Shield, Eye, Tag, Leaf, AlertTriangle,
  CreditCard, Star, MousePointer, Scale, ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DSA_RULES = [
  {
    icon: Eye,
    title: 'Ad Transparency',
    description: 'All ads must be clearly labeled as "Advertisement", "Sponsored", or equivalent.',
    examples: ['Hidden sponsored posts', 'Unmarked influencer ads', 'Native ads without disclosure'],
    penalty: 'Up to 6% of annual turnover'
  },
  {
    icon: Tag,
    title: 'Price History Requirement',
    description: 'When showing a discount, the lowest price from the last 30 days must be displayed.',
    examples: ['Fake "was €99, now €49"', 'Inflated reference prices', 'Manufactured sales'],
    penalty: 'Consumer refund + fine'
  },
  {
    icon: Leaf,
    title: 'Green Claims',
    description: 'Environmental claims must be verified and substantiated.',
    examples: ['"100% eco-friendly" without proof', 'Vague sustainability claims', 'Greenwashing'],
    penalty: 'Up to €50,000 per violation'
  },
  {
    icon: MousePointer,
    title: 'No Dark Patterns',
    description: 'Manipulative UI designs that trick users are prohibited.',
    examples: ['Hidden unsubscribe buttons', 'Confusing cookie dialogs', 'Forced account creation'],
    penalty: 'Service suspension'
  },
  {
    icon: Star,
    title: 'Review Authenticity',
    description: 'Platforms must verify that reviews come from real purchasers.',
    examples: ['Fake 5-star reviews', 'Paid review schemes', 'Competitor sabotage'],
    penalty: 'Platform delisting'
  },
  {
    icon: CreditCard,
    title: 'Total Price Display',
    description: 'All fees must be shown upfront, no hidden charges allowed.',
    examples: ['Hidden booking fees', 'Surprise shipping costs', 'Mandatory add-ons'],
    penalty: 'Transaction reversal'
  }
];

const FAQ_ITEMS = [
  {
    q: 'What is the Digital Services Act (DSA)?',
    a: 'The DSA is an EU regulation that creates a safer digital space where users\' rights are protected. It establishes clear responsibilities for online platforms regarding illegal content, transparent advertising, and user protection.'
  },
  {
    q: 'When did DSA 2025 rules come into effect?',
    a: 'The DSA became fully applicable to all platforms on February 17, 2024. Additional enforcement measures and stricter penalties are being phased in throughout 2025.'
  },
  {
    q: 'How can I report a DSA violation?',
    a: 'You can report violations directly through AdPiratin by clicking "Report Ad" and providing details about the violation. We anonymize your report and forward it to the appropriate EU authorities.'
  },
  {
    q: 'Are my reports anonymous?',
    a: 'Yes! AdPiratin anonymizes all reports before submission. Your personal data is never shared with advertisers or authorities unless you explicitly consent.'
  },
  {
    q: 'What countries are covered?',
    a: 'The DSA applies to all EU member states. AdPiratin currently focuses on Germany, France, Netherlands, Belgium, Austria, Spain, Italy, and Portugal.'
  },
  {
    q: 'Can advertisers see who reported them?',
    a: 'No. All reports are anonymized and aggregated before being shared. Advertisers only see trends, not individual reporters.'
  }
];

export default function DSAGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-2xl font-black text-white">DSA 2025 Guide</h1>
            <p className="text-[#8ba3c7] text-sm">Know your rights as an EU consumer</p>
          </div>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-[#1e90ff]/20 to-purple-500/20 backdrop-blur-xl border-[#1e90ff]/30 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#1e90ff]/20 rounded-xl">
                  <Scale className="w-8 h-8 text-[#1e90ff]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Digital Services Act 2025</h2>
                  <p className="text-[#c4d4e4]">
                    The EU's landmark regulation protecting consumers from misleading ads, 
                    fake reviews, and manipulative online practices. As of 2025, platforms 
                    face significant penalties for non-compliance.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Consumer Protection
                    </Badge>
                    <Badge className="bg-[#1e90ff]/20 text-[#1e90ff] border-[#1e90ff]/30">
                      Ad Transparency
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Platform Accountability
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#d4af37]" />
            Key DSA Rules
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {DSA_RULES.map((rule, i) => (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
              >
                <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 h-full hover:border-[#d4af37]/30 transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#d4af37]/10">
                        <rule.icon className="w-5 h-5 text-[#d4af37]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{rule.title}</h4>
                        <p className="text-[#8ba3c7] text-sm mt-1">{rule.description}</p>
                        
                        <div className="mt-3">
                          <p className="text-[#5a7a9a] text-xs mb-1">Common violations:</p>
                          <div className="flex flex-wrap gap-1">
                            {rule.examples.map((ex, j) => (
                              <Badge key={j} variant="outline" className="border-[#2a4a6a] text-[#8ba3c7] text-xs">
                                {ex}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-[#2a4a6a]/50">
                          <p className="text-red-400 text-xs">
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            Penalty: {rule.penalty}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardHeader>
              <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQ_ITEMS.map((item, i) => (
                  <AccordionItem 
                    key={i} 
                    value={`item-${i}`}
                    className="border-[#2a4a6a]/50 bg-[#0a1628]/50 rounded-xl px-4"
                  >
                    <AccordionTrigger className="text-white hover:text-[#d4af37] text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#8ba3c7]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[#8ba3c7] mb-4">
            Ready to fight for fair advertising?
          </p>
          <div className="flex justify-center gap-3">
            <Link to={createPageUrl('ReportAd')}>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report a Violation
              </Button>
            </Link>
            <a href="https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-[#2a4a6a] text-white hover:bg-[#1a2d4a]">
                Official EU DSA Page
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}