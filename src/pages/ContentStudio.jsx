import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Video, Download, Share2, Sparkles, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ArticleEditor from '@/components/content/ArticleEditor';
import EnhancedMemeGenerator from '@/components/content/EnhancedMemeGenerator';
import VideoScriptGenerator from '@/components/content/VideoScriptGenerator';

const CONTENT_TYPES = [
  { 
    id: 'article',
    label: 'Digital Article', 
    icon: FileText, 
    color: 'from-blue-500 to-cyan-500',
    points: 75,
    description: 'Write articles exposing deceptive ads'
  },
  { 
    id: 'meme',
    label: 'Social Meme', 
    icon: Image, 
    color: 'from-purple-500 to-pink-500',
    points: 50,
    description: 'Create viral memes to spread awareness'
  },
  { 
    id: 'video',
    label: 'Video Script', 
    icon: Video, 
    color: 'from-red-500 to-orange-500',
    points: 100,
    description: 'Generate scripts for short videos'
  }
];

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState('article');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Content Studio</h1>
              <p className="text-[#8ba3c7]">Create content to fight deception. Earn points & royalties.</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span className="text-white font-bold">Under Clan Flag</span>
              </div>
            </div>
          </div>

          {/* Content Type Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {CONTENT_TYPES.map((type) => (
              <Card
                key={type.id}
                className={`bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all cursor-pointer ${
                  activeTab === type.id ? 'border-[#d4af37]/50 ring-2 ring-[#d4af37]/20' : ''
                }`}
                onClick={() => setActiveTab(type.id)}
              >
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-3`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-1">{type.label}</h3>
                  <p className="text-[#8ba3c7] text-sm mb-3">{type.description}</p>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[#d4af37] font-bold">+{type.points} pts</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Content Creator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="article">
              <ArticleEditor />
            </TabsContent>

            <TabsContent value="meme">
              <EnhancedMemeGenerator />
            </TabsContent>

            <TabsContent value="video">
              <VideoScriptGenerator />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-[#1a2d4a]/30 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#d4af37] mt-1" />
                <div>
                  <h4 className="text-white font-bold mb-2">Pro Tips</h4>
                  <ul className="text-[#8ba3c7] text-sm space-y-1">
                    <li>• Share your content on social media to earn extra points</li>
                    <li>• Content under your clan flag contributes to clan leaderboard</li>
                    <li>• Top creators get featured on NovaLibertalia Live</li>
                    <li>• Viral content earns royalty bonuses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}