import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, ThumbsUp, ExternalLink, Share2, Eye,
  TrendingUp, Award, Filter, Twitter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DECEPTION_CATEGORIES } from './CategorySelector';

export default function WallOfShame() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: exposes = [], isLoading } = useQuery({
    queryKey: ['wall_of_shame'],
    queryFn: () => base44.entities.Expose.filter({ status: 'wall_of_shame' }, '-community_votes', 50)
  });

  const voteMutation = useMutation({
    mutationFn: async (exposeId) => {
      const expose = exposes.find(e => e.id === exposeId);
      await base44.entities.Expose.update(exposeId, {
        community_votes: (expose?.community_votes || 0) + 1
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['wall_of_shame'])
  });

  const shareToX = (expose) => {
    const category = DECEPTION_CATEGORIES.find(c => c.id === expose.category);
    const text = `🏴‍☠️ EXPOSED: ${expose.target}\n\n${expose.title}\n\nCategory: ${category?.label}\nSeverity: ${expose.severity}/10\n\n#PlunderTheLies #AdPiratin #TruthBounty`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://adpiratin.com/expose/${expose.id}`;
    window.open(url, '_blank');
    
    base44.analytics.track({
      eventName: 'expose_shared_x',
      properties: { expose_id: expose.id }
    });
  };

  const filteredExposes = filter === 'all' 
    ? exposes 
    : exposes.filter(e => e.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Skull className="w-12 h-12 text-red-500" />
            </motion.div>
            <h1 className="text-4xl font-black text-white">Wall of Shame</h1>
          </div>
          <p className="text-[#8ba3c7] text-lg">
            The most notorious deceptions exposed by our pirate crew
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-[#d4af37] text-[#0a1628]' : 'border-[#2a4a6a] text-[#8ba3c7]'}
        >
          <Filter className="w-4 h-4 mr-2" />
          All
        </Button>
        {DECEPTION_CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={filter === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(cat.id)}
            className={filter === cat.id ? 'bg-[#d4af37] text-[#0a1628]' : 'border-[#2a4a6a] text-[#8ba3c7]'}
          >
            <cat.icon className="w-4 h-4 mr-2" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Exposes Grid */}
      <AnimatePresence mode="popLayout">
        {filteredExposes.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Skull className="w-16 h-16 text-[#5a7a9a] mx-auto mb-4" />
            <p className="text-[#8ba3c7]">No exposes in this category yet. Be the first to bust a lie!</p>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {filteredExposes.map((expose, i) => {
            const category = DECEPTION_CATEGORIES.find(c => c.id === expose.category);
            return (
              <motion.div
                key={expose.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-[#1a2d4a]/80 to-[#0f2137]/60 backdrop-blur-xl border-red-500/30 hover:border-red-500/60 transition-all overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge className={`bg-gradient-to-r ${category?.color} text-white`}>
                        {category?.label}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-red-500/30 text-red-400">
                          <Award className="w-3 h-3 mr-1" />
                          {expose.severity}/10
                        </Badge>
                        {expose.real_bounty_eur > 0 && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            €{expose.real_bounty_eur}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-red-400 transition-colors">
                      {expose.title}
                    </CardTitle>
                    <p className="text-red-400 text-sm font-semibold">Target: {expose.target}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-[#8ba3c7] text-sm line-clamp-3">
                      {expose.description}
                    </p>

                    {expose.ai_analysis && (
                      <div className="bg-[#0a1628]/50 rounded-lg p-3 border border-[#2a4a6a]/30">
                        <p className="text-[#1e90ff] text-xs font-semibold mb-1">🤖 AI Analysis:</p>
                        <p className="text-[#8ba3c7] text-xs line-clamp-2">{expose.ai_analysis}</p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[#8ba3c7]">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{expose.community_votes || 0}</span>
                      </div>
                      {expose.x_reach > 0 && (
                        <div className="flex items-center gap-1 text-[#1e90ff]">
                          <Eye className="w-4 h-4" />
                          <span>{expose.x_reach.toLocaleString()}</span>
                        </div>
                      )}
                      <Badge className="ml-auto bg-[#d4af37]/20 text-[#d4af37]">
                        +{expose.bounty_awarded} pts
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => voteMutation.mutate(expose.id)}
                        className="flex-1 border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] hover:text-white"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Vote
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToX(expose)}
                        className="flex-1 bg-[#1da1f2] hover:bg-[#1a8cd8] text-white"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}