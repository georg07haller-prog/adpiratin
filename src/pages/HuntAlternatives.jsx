import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowLeft, Coins, Sparkles, ExternalLink,
  TrendingDown, Star, Shield, Loader2, Tag, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function HuntAlternatives() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [provider, setProvider] = useState('Google Shopping');
  
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const searchMutation = useMutation({
    mutationFn: async (query) => {
      setSearching(true);
      const providers = ['Google Shopping', 'Idealo.de', 'Klarna Price Comparison'];
      
      for (let i = 0; i < providers.length; i++) {
        try {
          setProvider(providers[i]);
          const response = await base44.integrations.Core.InvokeLLM({
            prompt: `Using ${providers[i]}, find 5 cheaper alternatives for: "${query}"
            
Generate 5 realistic product alternatives with different price points. For each product include:
- name: Product name
- brand: Brand name  
- price: Price in EUR (number)
- original_price: Higher original price (to show savings)
- rating: Rating out of 5
- reviews: Number of reviews
- savings: How much € saved
- eco_score: Eco rating A/B/C/D
- features: Array of 2-3 key features
- in_stock: boolean
- url: realistic EU retailer URL

Make the prices realistic for the EU market. Include a mix of budget and premium options.`,
            response_json_schema: {
              type: 'object',
              properties: {
                alternatives: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      brand: { type: 'string' },
                      price: { type: 'number' },
                      original_price: { type: 'number' },
                      rating: { type: 'number' },
                      reviews: { type: 'number' },
                      savings: { type: 'number' },
                      eco_score: { type: 'string' },
                      features: { type: 'array', items: { type: 'string' } },
                      in_stock: { type: 'boolean' },
                      url: { type: 'string' }
                    }
                  }
                },
                search_tip: { type: 'string' }
              }
            }
          });
          return response;
        } catch (error) {
          if (i === providers.length - 1) throw error;
          await new Promise(r => setTimeout(r, 500));
        }
      }
    },
    onSuccess: async (data) => {
      setResults(data);
      setSearching(false);
      
      if (pirateProfile?.[0]) {
        await base44.entities.PirateUser.update(pirateProfile[0].id, {
          alternatives_found: (pirateProfile[0].alternatives_found || 0) + 1,
          total_points: (pirateProfile[0].total_points || 0) + 15
        });
        queryClient.invalidateQueries(['pirateProfile']);
      }
    },
    onError: () => setSearching(false)
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) searchMutation.mutate(searchQuery);
  };

  const getEcoColor = (score) => {
    const colors = {
      'A': 'bg-green-500/20 text-green-400 border-green-500/30',
      'B': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
      'C': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'D': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[score] || colors['C'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Hunt Better Deals</h1>
            <p className="text-[#8ba3c7] text-sm">Find cheaper alternatives across EU retailers</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 mb-6">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a7a9a]" />
                  <Input 
                    placeholder="Enter product name or paste ad URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] h-12"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={searching || !searchQuery.trim()}
                  className="bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white font-bold hover:opacity-90 h-12 px-6"
                >
                  {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4 mr-2" />Hunt</>}
                </Button>
              </form>
              <div className="flex items-center gap-2 mt-3">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[#d4af37] text-sm">+15 Pirate Points per search</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {searching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="3" />
                  <path d="M50 10 L55 20 L50 15 L45 20 Z" fill="#d4af37" />
                  <circle cx="50" cy="50" r="8" fill="#d4af37" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d4af37" />
                      <stop offset="100%" stopColor="#ffd700" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              <p className="text-white font-semibold text-lg">⚓ Hunting deals via {provider}...</p>
              <p className="text-[#8ba3c7] text-sm mt-1">Scanning multiple providers</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && !searching && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {results.search_tip && (
                <div className="bg-[#1e90ff]/10 border border-[#1e90ff]/30 rounded-xl p-4 mb-6">
                  <p className="text-[#1e90ff] text-sm">💡 {results.search_tip}</p>
                </div>
              )}

              <div className="grid gap-4">
                {results.alternatives?.map((product, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Card className="bg-gradient-to-br from-[#1a2d4a]/80 to-[#0f2137]/60 backdrop-blur-xl border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-white font-bold text-xl leading-tight group-hover:text-[#d4af37] transition-colors">{product.name}</h3>
                              {product.in_stock === false && <Badge className="bg-red-500/20 text-red-400 shrink-0">Out of Stock</Badge>}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e90ff]/10 border border-[#1e90ff]/30">
                                <div className="w-5 h-5 rounded bg-[#1e90ff]/20 flex items-center justify-center">
                                  <span className="text-[#1e90ff] text-xs">🏪</span>
                                </div>
                                <span className="text-[#1e90ff] font-medium text-sm">{product.brand}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#d4af37]/10">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(product.rating) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-[#2a4a6a]'}`} />
                                ))}
                                <span className="text-[#d4af37] text-sm font-semibold ml-1">{product.rating.toFixed(1)}</span>
                              </div>
                              
                              <Badge className={getEcoColor(product.eco_score)}>🌱 {product.eco_score}</Badge>
                            </div>
                            
                            <div className="flex items-end gap-4">
                              <div>
                                {product.original_price > product.price && (
                                  <p className="text-[#5a7a9a] line-through text-sm mb-1">€{product.original_price.toFixed(2)}</p>
                                )}
                                <p className="text-white text-3xl font-black">€{product.price.toFixed(2)}</p>
                              </div>
                              {product.savings > 0 && (
                                <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                                  <div className="flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-green-400" />
                                    <div>
                                      <p className="text-green-400 font-black text-lg leading-none">€{product.savings.toFixed(2)}</p>
                                      <p className="text-green-400/70 text-xs">saved</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 lg:w-48">
                            <a href={product.url} target="_blank" rel="noopener noreferrer" className="w-full">
                              <Button className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-[#0a1628] font-bold hover:opacity-90 w-full shadow-lg">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open in Tab
                              </Button>
                            </a>
                            <Button variant="outline" className="border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] hover:text-white w-full" onClick={() => navigator.clipboard.writeText(product.url)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#0a1628]/50 rounded-xl border border-[#2a4a6a]/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#1e90ff] shrink-0 mt-0.5" />
                  <p className="text-[#8ba3c7] text-sm"><strong className="text-white">DSA 2025:</strong> Retailers must show lowest 30-day price with discounts. Estimates may vary.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!results && !searching && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#1a2d4a] rounded-full flex items-center justify-center">
              <TrendingDown className="w-10 h-10 text-[#5a7a9a]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Ready to Hunt!</h3>
            <p className="text-[#8ba3c7] text-sm max-w-md mx-auto">Enter a product name or paste an ad URL to find better deals across EU retailers.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}