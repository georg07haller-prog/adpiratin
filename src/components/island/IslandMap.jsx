import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock, Home, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GRID_SIZE = 10;

export default function IslandMap({ ownedPlots = [], villaSkin = 'classic' }) {
  const [selectedPlot, setSelectedPlot] = useState(null);

  const generateGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const plotId = `${x}-${y}`;
        const isOwned = ownedPlots.includes(plotId);
        const isPremium = (x >= 4 && x <= 5) && (y >= 4 && y <= 5); // Center plots
        grid.push({ id: plotId, x, y, isOwned, isPremium });
      }
    }
    return grid;
  };

  const plots = generateGrid();
  const selectedPlotData = plots.find(p => p.id === selectedPlot);

  const villaIcons = {
    classic: '🏴‍☠️',
    gold: '👑',
    kraken: '🐙'
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Map */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#d4af37]" />
          NovaLibertalia Map
        </h3>
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 p-4">
          <div className="grid grid-cols-10 gap-1">
            {plots.map((plot) => (
              <motion.button
                key={plot.id}
                className={`aspect-square rounded ${
                  plot.isOwned
                    ? 'bg-gradient-to-br from-[#d4af37] to-[#b8962e]'
                    : plot.isPremium
                    ? 'bg-purple-500/20 border border-purple-500/40'
                    : 'bg-[#0a1628]/50 border border-[#2a4a6a]/30'
                } hover:scale-110 transition-all relative`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPlot(plot.id)}
              >
                {plot.isOwned && (
                  <span className="absolute inset-0 flex items-center justify-center text-xs">
                    {villaIcons[villaSkin]}
                  </span>
                )}
                {!plot.isOwned && plot.isPremium && (
                  <Sparkles className="absolute inset-0 m-auto w-2 h-2 text-purple-400" />
                )}
              </motion.button>
            ))}
          </div>
        </Card>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded" />
            <span className="text-[#8ba3c7]">Your Villa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500/20 border border-purple-500/40 rounded" />
            <span className="text-[#8ba3c7]">Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#0a1628]/50 border border-[#2a4a6a]/30 rounded" />
            <span className="text-[#8ba3c7]">Available</span>
          </div>
        </div>
      </div>

      {/* Plot Details */}
      <div>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Home className="w-5 h-5 text-[#1e90ff]" />
          Plot Details
        </h3>
        {selectedPlotData ? (
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-6">
              {selectedPlotData.isOwned ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">{villaIcons[villaSkin]}</div>
                  <h4 className="text-white font-bold text-xl mb-2">Your Villa</h4>
                  <Badge className="bg-[#d4af37]/20 text-[#d4af37] mb-4">
                    Plot {selectedPlotData.id}
                  </Badge>
                  <p className="text-[#8ba3c7] text-sm mb-4">
                    Your personal space in NovaLibertalia. Customize with villa skins from the marketplace!
                  </p>
                  <div className="p-4 bg-[#0a1628]/50 rounded-xl">
                    <p className="text-[#5a7a9a] text-xs">
                      🏗️ Coming soon: Upgrade your villa, host events, earn passive Doubloons!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Lock className="w-12 h-12 text-[#5a7a9a] mx-auto mb-4" />
                  <h4 className="text-white font-bold mb-2">
                    {selectedPlotData.isPremium ? 'Premium Plot' : 'Available Plot'}
                  </h4>
                  <Badge className={selectedPlotData.isPremium ? 'bg-purple-500/20 text-purple-400' : 'bg-[#2a4a6a]/50 text-[#8ba3c7]'}>
                    Plot {selectedPlotData.id}
                  </Badge>
                  <p className="text-[#8ba3c7] text-sm mt-4 mb-6">
                    {selectedPlotData.isPremium 
                      ? 'Premium location in the heart of NovaLibertalia. Higher yield potential!'
                      : 'Standard plot perfect for starting your island journey.'
                    }
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]"
                    disabled
                  >
                    Claim Your Land Soon!
                  </Button>
                  <p className="text-[#5a7a9a] text-xs mt-3">
                    🚧 Land claiming coming Q2 2026
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-6 text-center">
              <MapPin className="w-12 h-12 text-[#5a7a9a] mx-auto mb-4" />
              <p className="text-[#8ba3c7]">Click on a plot to view details</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}