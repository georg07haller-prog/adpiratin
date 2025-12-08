import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowLeft, Coins, Sparkles, ExternalLink,
  TrendingDown, Star, Shield, Loader2, Tag
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
      
      // Use LLM to find alternatives (simulated product search)
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a price comparison assistant. The user is looking for alternatives to: "${query}"
        
Generate 5 realistic product alternatives with different price points. For each product include:
- name: Product name
- brand: Brand name
- price: Price in EUR (number)
- original_price: Higher original price (to show savings)
- rating: Rating out of 5
- reviews: Number of reviews
- savings_percent: Percentage saved
- eco_score: Eco rating A/B/C/D
- features: Array of 2-3 key features

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
                  savings_percent: { type: 'number' },
                  eco_score: { type: 'string' },
                  features: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            search_tip: { type: 'string' }
          }
        }
      });
      
      return response;
    },
    onSuccess: async (data) => {
      setResults(data);
      setSearching(false);
      
      // Award points for searching
      if (pirateProfile?.[0]) {
        await base44.entities.PirateUser.update(pirateProfile[0].id, {
          alternatives_found: (pirateProfile[0].alternatives_found || 0) + 1,
          total_points: (pirateProfile[0].total_points || 0) + 10
        });
        queryClient.invalidateQueries(['pirateProfile']);
      }
    },
    onError: () => {
      setSearching(false);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
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
            <h1 className="text-2xl font-black text-white">Hunt Better Deals</h1>
            <p className="text-[#8ba3c7] text-sm">Find cheaper alternatives to overpriced products</p>
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 mb-6">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a7a9a]" />
                  <Input 
                    placeholder="Enter product name, brand, or paste ad URL..."
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
                  {searching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Hunt
                    </>
                  )}
                </Button>
              </form>
              
              <div className="flex items-center gap-2 mt-3">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-[#d4af37] text-sm">+10 Pirate Points per search</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {searching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Search className="w-16 h-16 text-[#1e90ff]" />
              </motion.div>
              <p className="text-white font-semibold">Scanning the seven seas for deals...</p>
              <p className="text-[#8ba3c7] text-sm mt-1">Comparing prices across EU retailers</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && !searching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Tip */}
              {results.search_tip && (
                <div className="bg-[#1e90ff]/10 border border-[#1e90ff]/30 rounded-xl p-4 mb-6">
                  <p className="text-[#1e90ff] text-sm">
                    💡 {results.search_tip}
                  </p>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid gap-4">
                {results.alternatives?.map((product, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all">
                      <CardContent className="p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Product Image Placeholder */}
                          <div className="w-20 h-20 bg-gradient-to-br from-[#2a4a6a] to-[#1a2d4a] rounded-xl flex items-center justify-center shrink-0">
                            <Tag className="w-8 h-8 text-[#5a7a9a]" />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-[#8ba3c7] text-xs">{product.brand}</p>
                                <h3 className="text-white font-bold">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white text-sm ml-1">{product.rating}</span>
                                  </div>
                                  <span className="text-[#5a7a9a] text-sm">({product.reviews} reviews)</span>
                                </div>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="text-[#5a7a9a] line-through text-sm">€{product.original_price}</span>
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                    -{product.savings_percent}%
                                  </Badge>
                                </div>
                                <p className="text-2xl font-black text-white">€{product.price}</p>
                              </div>
                            </div>
                            
                            {/* Features & Eco Score */}
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <Badge className={getEcoColor(product.eco_score)}>
                                Eco: {product.eco_score}
                              </Badge>
                              {product.features?.map((feature, fi) => (
                                <Badge key={fi} variant="outline" className="border-[#2a4a6a] text-[#8ba3c7]">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Action */}
                          <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90 shrink-0">
                            View Deal
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* DSA Notice */}
              <div className="mt-6 p-4 bg-[#0a1628]/50 rounded-xl border border-[#2a4a6a]/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#1e90ff] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#8ba3c7] text-sm">
                      <strong className="text-white">DSA 2025 Notice:</strong> Under EU Digital Services Act, 
                      retailers must show the lowest price from the past 30 days when displaying a discount.
                      Prices shown here are estimates and may vary by retailer.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!results && !searching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-[#1a2d4a] rounded-full flex items-center justify-center">
              <TrendingDown className="w-10 h-10 text-[#5a7a9a]" />
            </div>
            <h3 className="text-white font-semibold mb-2">Ready to Hunt!</h3>
            <p className="text-[#8ba3c7] text-sm max-w-md mx-auto">
              Enter a product name or paste an ad URL to find better deals and alternatives across EU retailers.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}