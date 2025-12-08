import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Chrome, Eye, EyeOff, AlertTriangle, Search,
  X, ChevronRight, Skull, Coins, Sparkles, ExternalLink,
  Check, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MOCK_ADS = [
  { id: 1, brand: 'Zalando', type: 'Sponsored', issue: 'Fake 50% off - price was never €120', detected: false },
  { id: 2, brand: 'Amazon', type: 'Advertisement', issue: 'Hidden subscribe checkbox', detected: false },
  { id: 3, brand: 'H&M', type: 'Werbung', issue: 'Unverified eco-friendly claim', detected: false }
];

export default function ExtensionDemo() {
  const [scanning, setScanning] = useState(false);
  const [detectedAds, setDetectedAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);
  const [points, setPoints] = useState(1250);

  const startScan = () => {
    setScanning(true);
    setDetectedAds([]);
    setActionTaken(null);
    
    // Simulate detection
    MOCK_ADS.forEach((ad, i) => {
      setTimeout(() => {
        setDetectedAds(prev => [...prev, ad]);
        if (i === MOCK_ADS.length - 1) {
          setScanning(false);
        }
      }, 1000 * (i + 1));
    });
  };

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
    setShowPopup(true);
  };

  const handleAction = (action) => {
    setActionTaken(action);
    if (action === 'hunt') setPoints(p => p + 10);
    if (action === 'kill') setPoints(p => p + 5);
    if (action === 'bust') setPoints(p => p + 25);
    
    setTimeout(() => {
      setShowPopup(false);
      setSelectedAd(null);
      if (action === 'kill') {
        setDetectedAds(prev => prev.filter(a => a.id !== selectedAd.id));
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
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
              <Chrome className="w-6 h-6 text-[#1e90ff]" />
              Extension Demo
            </h1>
            <p className="text-[#8ba3c7] text-sm">See how AdPiratin works in your browser</p>
          </div>
        </motion.div>

        {/* Browser Mockup */}
        <div className="relative">
          {/* Browser Chrome */}
          <div className="bg-[#1e293b] rounded-t-xl p-3 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-[#0f172a] rounded-lg px-4 py-1.5">
              <span className="text-green-400 text-xs">🔒</span>
              <span className="text-[#8ba3c7] text-sm">example-shop.eu/products</span>
            </div>
            {/* Extension Icon */}
            <motion.div 
              className="relative cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={startScan}
            >
              <div className={`p-1.5 rounded-lg ${scanning ? 'bg-[#d4af37]' : 'bg-[#1a2d4a]'} transition-colors`}>
                <Skull className={`w-5 h-5 ${scanning ? 'text-[#0a1628]' : 'text-[#d4af37]'}`} />
              </div>
              {detectedAds.length > 0 && !scanning && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {detectedAds.length}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Browser Content */}
          <div className="bg-white rounded-b-xl p-6 min-h-[500px] relative">
            {/* Fake page content */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Regular product */}
              <div className="border rounded-lg p-4">
                <div className="w-full h-32 bg-gray-100 rounded-lg mb-3" />
                <h3 className="font-semibold text-gray-800">Regular Product</h3>
                <p className="text-gray-500 text-sm">Great quality item</p>
                <p className="text-lg font-bold text-gray-900 mt-2">€49.99</p>
              </div>

              {/* Sponsored ads */}
              {MOCK_ADS.map((ad, i) => {
                const isDetected = detectedAds.find(d => d.id === ad.id);
                const isKilled = actionTaken === 'kill' && selectedAd?.id === ad.id;
                
                return (
                  <motion.div
                    key={ad.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                      isDetected && !isKilled ? 'border-red-400 border-2' : ''
                    } ${isKilled ? 'opacity-0' : ''}`}
                    onClick={() => isDetected && handleAdClick(ad)}
                    whileHover={isDetected ? { scale: 1.02 } : {}}
                  >
                    {/* Ad badge */}
                    <div className="absolute top-2 right-2 text-[10px] text-gray-400">
                      {ad.type}
                    </div>
                    
                    <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">{ad.brand[0]}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{ad.brand} Deal</h3>
                    <p className="text-gray-500 text-sm line-through">€120.00</p>
                    <p className="text-lg font-bold text-red-600">€59.99 <span className="text-sm">-50%</span></p>
                    
                    {/* Detection overlay */}
                    <AnimatePresence>
                      {isDetected && !isKilled && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-red-500/10 rounded-lg flex items-center justify-center"
                        >
                          <Badge className="bg-red-500 text-white">
                            <Target className="w-3 h-3 mr-1" />
                            Ad Detected
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Scanning overlay */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#0a1628]/80 flex items-center justify-center rounded-b-xl"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Eye className="w-16 h-16 text-[#1e90ff] mx-auto mb-4" />
                    </motion.div>
                    <p className="text-white font-semibold">Scanning for ads...</p>
                    <p className="text-[#8ba3c7] text-sm">Looking for data-ad, aria-label, Werbung, Sponsored...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AdPiratin Popup */}
        <AnimatePresence>
          {showPopup && selectedAd && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-8 right-8 z-50 w-80"
            >
              <Card className="bg-[#1a2d4a] border-[#d4af37]/30 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skull className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-white font-bold">AdPiratin</span>
                  </div>
                  <button onClick={() => setShowPopup(false)}>
                    <X className="w-4 h-4 text-[#8ba3c7]" />
                  </button>
                </div>
                
                <CardContent className="p-4">
                  {/* Ad info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{selectedAd.brand}</span>
                      <Badge className="bg-red-500/20 text-red-400 text-xs">DSA Violation</Badge>
                    </div>
                    <p className="text-[#8ba3c7] text-sm">{selectedAd.issue}</p>
                  </div>

                  {/* Action taken feedback */}
                  <AnimatePresence>
                    {actionTaken && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-green-500/20 rounded-lg flex items-center gap-2"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">
                          {actionTaken === 'hunt' && '+10 pts - Finding alternatives...'}
                          {actionTaken === 'kill' && '+5 pts - Ad hidden!'}
                          {actionTaken === 'bust' && '+25 pts - Reported!'}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  {!actionTaken && (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => handleAction('hunt')}
                        className="w-full bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white justify-start"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Hunt Alternatives
                        <span className="ml-auto text-xs opacity-70">+10 pts</span>
                      </Button>
                      <Button 
                        onClick={() => handleAction('kill')}
                        variant="outline"
                        className="w-full border-[#2a4a6a] text-white hover:bg-[#2a4a6a] justify-start"
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Kill Silently
                        <span className="ml-auto text-xs opacity-70">+5 pts</span>
                      </Button>
                      <Button 
                        onClick={() => handleAction('bust')}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white justify-start"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        BUSTED!
                        <span className="ml-auto text-xs opacity-70">+25 pts</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Points Counter */}
        <motion.div
          className="fixed top-24 md:top-8 right-8 z-40"
          animate={{ scale: actionTaken ? [1, 1.2, 1] : 1 }}
        >
          <div className="bg-[#1a2d4a] border border-[#d4af37]/30 rounded-xl px-4 py-2 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#d4af37]" />
            <span className="text-white font-bold">{points.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-6">
              <h3 className="text-white font-bold mb-4">How it works:</h3>
              <ol className="space-y-3">
                {[
                  'Click the AdPiratin icon (skull) in the browser toolbar to scan the page',
                  'Detected ads are highlighted with a red border',
                  'Click on a detected ad to see options',
                  'Choose to Hunt alternatives, Kill the ad, or report (BUSTED!)',
                  'Earn Pirate Points for every action!'
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#8ba3c7]">
                    <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center shrink-0 text-sm font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}