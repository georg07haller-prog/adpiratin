import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  X, Image as ImageIcon, Video, Share2, Loader2, 
  Download, Sparkles, Twitter, MessageCircle, Instagram,
  Copy, CheckCircle, Coins, Skull
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MEME_TEMPLATES = [
  { id: 'busted', text: 'BUSTED by AdPiratin! 🏴‍☠️', gradient: 'from-red-500 to-orange-500' },
  { id: 'lies', text: 'Ads lie, Pirates win! ⚔️', gradient: 'from-purple-500 to-pink-500' },
  { id: 'savings', text: 'Found cheaper! Thanks pirates! 💰', gradient: 'from-green-500 to-emerald-500' },
  { id: 'exposed', text: 'EXPOSED: Fake Discount 🚨', gradient: 'from-yellow-500 to-red-500' }
];

export default function ContentGeneratorPopup({ 
  isOpen, 
  onClose, 
  adData,
  onPointsEarned 
}) {
  const [mode, setMode] = useState(null); // 'meme' or 'shorts'
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(MEME_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState({});

  const generateMeme = async () => {
    setGenerating(true);
    try {
      const prompt = `Create a viral pirate-themed meme image exposing misleading advertising:

Context: ${adData.description}
Advertiser: ${adData.advertiser}
Violation: ${adData.violationType}

Style: Bold, eye-catching design with pirate aesthetic (deep blue #0a1628, gold #d4af37, skull icons)
Text overlay: "${selectedTemplate.text}"
Bottom watermark: "Call the Pirates – adpiratin.com"

Make it shareable, funny, and mission-aligned. Should expose bad ads publicly!`;

      const { url } = await base44.integrations.Core.GenerateImage({
        prompt,
        existing_image_urls: adData.screenshotUrl ? [adData.screenshotUrl] : undefined
      });

      setGeneratedContent({
        type: 'meme',
        url,
        shareText: `🏴‍☠️ Just caught a shady ad trying to rip us off! ${adData.advertiser} is ${adData.violationType}. Pirates exposed it! #AdPiratin #FairPrices #DSA2025`
      });

      // Award points
      if (onPointsEarned) onPointsEarned(5);
    } catch (error) {
      console.error('Meme generation failed:', error);
    }
    setGenerating(false);
  };

  const generateShorts = async () => {
    setGenerating(true);
    try {
      // Generate key frame for shorts video
      const prompt = `Create a dramatic video thumbnail for a pirate-themed "ad exposed" short video:

Title overlay: "THIS AD IS LYING! 🚨"
Context: ${adData.description}
Advertiser: ${adData.advertiser}

Visual elements:
- Split screen: Shady ad on left, pirate flag on right
- Bold text: "BUSTED BY ADPIRATIN"
- Savings badge showing potential deal
- Pirate aesthetic: deep blue, gold accents, skull icons
- Bottom: "Join the pirates at adpiratin.com"

Dramatic, attention-grabbing, TikTok/Instagram Reels style!`;

      const { url } = await base44.integrations.Core.GenerateImage({
        prompt,
        existing_image_urls: adData.screenshotUrl ? [adData.screenshotUrl] : undefined
      });

      setGeneratedContent({
        type: 'shorts',
        url,
        shareText: `🎬 NEW VIDEO: Exposing ${adData.advertiser}'s shady tactics! This ad is lying about ${adData.violationType}. Time to call the pirates! 🏴‍☠️ #AdPiratin #ExposedAds #FairPrices`,
        videoScript: `[Pirate voice]: "Ahoy! This ad from ${adData.advertiser} is LYING! They claim ${adData.description}. But we found the TRUTH! Check out these REAL deals instead. Don't get scammed - join the pirates at adpiratin.com!"`
      });

      // Award points
      if (onPointsEarned) onPointsEarned(10);
    } catch (error) {
      console.error('Shorts generation failed:', error);
    }
    setGenerating(false);
  };

  const handleShare = async (platform) => {
    const shareUrl = `https://adpiratin.com?ref=${platform}&ad=${adData.id}`;
    const text = generatedContent.shareText;

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      instagram: generatedContent.url // Download for IG
    };

    if (platform === 'instagram') {
      // For Instagram, download the image
      const link = document.createElement('a');
      link.href = generatedContent.url;
      link.download = `adpiratin-${generatedContent.type}-${Date.now()}.png`;
      link.click();
    } else {
      window.open(urls[platform], '_blank');
    }

    setShared(prev => ({ ...prev, [platform]: true }));
    
    // Track share event
    base44.analytics.track({
      eventName: 'content_shared',
      properties: {
        platform,
        content_type: generatedContent.type,
        ad_id: adData.id
      }
    });

    // Bonus points for sharing
    if (onPointsEarned && !shared[platform]) {
      onPointsEarned(5);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedContent.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-gradient-to-br from-[#1a2d4a] to-[#0f2137] border-[#d4af37]/30">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-xl">
                    <Skull className="w-6 h-6 text-[#0a1628]" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-xl">Pirate Content Generator</h2>
                    <p className="text-[#8ba3c7] text-sm">Turn this lie into viral content!</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Mode Selection */}
              {!mode && !generatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card 
                    className="bg-[#0a1628]/50 border-[#2a4a6a]/50 hover:border-[#d4af37]/50 transition-all cursor-pointer group"
                    onClick={() => setMode('meme')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">Generate Meme</h3>
                          <p className="text-[#8ba3c7] text-sm">AI-powered pirate meme with watermark</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Coins className="w-4 h-4 text-[#d4af37]" />
                            <span className="text-[#d4af37] text-sm font-semibold">+5 pts + 5 pts per share</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-[#0a1628]/50 border-[#2a4a6a]/50 hover:border-[#1e90ff]/50 transition-all cursor-pointer group"
                    onClick={() => setMode('shorts')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-[#1e90ff]/20 to-cyan-400/20 rounded-xl group-hover:scale-110 transition-transform">
                          <Video className="w-8 h-8 text-[#1e90ff]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">Generate Shorts</h3>
                          <p className="text-[#8ba3c7] text-sm">15-30s video preview with pirate voiceover</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Coins className="w-4 h-4 text-[#d4af37]" />
                            <span className="text-[#d4af37] text-sm font-semibold">+10 pts + 5 pts per share</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#d4af37] text-sm font-semibold mb-1">Viral Mission</p>
                        <p className="text-[#c4d4e4] text-sm">Help expose bad ads publicly! Share on social media to warn others and earn bonus points for high reach.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Template Selection (Meme Only) */}
              {mode === 'meme' && !generatedContent && !generating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-white font-bold">Choose Template</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {MEME_TEMPLATES.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          selectedTemplate.id === template.id
                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                            : 'border-[#2a4a6a]/50 hover:border-[#d4af37]/50 bg-[#0a1628]/50'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardContent className="p-4">
                          <div className={`h-20 rounded-lg bg-gradient-to-r ${template.gradient} flex items-center justify-center mb-2`}>
                            <p className="text-white font-black text-center text-sm px-2">{template.text}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button
                    onClick={generateMeme}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate Meme
                  </Button>
                </motion.div>
              )}

              {/* Generate Shorts */}
              {mode === 'shorts' && !generatedContent && !generating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-[#0a1628]/50 rounded-xl p-4 space-y-2">
                    <h3 className="text-white font-bold mb-2">Video Preview</h3>
                    <p className="text-[#8ba3c7] text-sm">Your 15-30s shorts will include:</p>
                    <ul className="space-y-1 text-[#8ba3c7] text-sm">
                      <li>• 🎬 Dramatic intro with pirate voiceover</li>
                      <li>• 📸 Ad screenshot exposure</li>
                      <li>• 💰 Alternative deals showcase</li>
                      <li>• 🏴‍☠️ CTA: "Join the pirates at adpiratin.com"</li>
                      <li>• ⚓ Watermark throughout</li>
                    </ul>
                  </div>
                  <Button
                    onClick={generateShorts}
                    className="w-full bg-gradient-to-r from-[#1e90ff] to-cyan-400 text-white font-bold hover:opacity-90"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Generate Video Preview
                  </Button>
                </motion.div>
              )}

              {/* Generating State */}
              {generating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-[#0a1628]" />
                  </motion.div>
                  <p className="text-white font-semibold text-lg mb-2">
                    🏴‍☠️ Creating viral content...
                  </p>
                  <p className="text-[#8ba3c7] text-sm">
                    AI pirates are working their magic!
                  </p>
                </motion.div>
              )}

              {/* Generated Content */}
              {generatedContent && !generating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Preview */}
                  <div className="relative rounded-xl overflow-hidden border-2 border-[#d4af37]">
                    <img 
                      src={generatedContent.url} 
                      alt="Generated content"
                      className="w-full"
                    />
                    <Badge className="absolute top-3 right-3 bg-[#d4af37] text-[#0a1628]">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Generated!
                    </Badge>
                  </div>

                  {/* Video Script (Shorts Only) */}
                  {generatedContent.type === 'shorts' && generatedContent.videoScript && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#1e90ff]" />
                        Voiceover Script
                      </h4>
                      <p className="text-[#8ba3c7] text-sm italic">{generatedContent.videoScript}</p>
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#d4af37]" />
                      Share & Earn +5 pts each
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleShare('twitter')}
                        className="bg-[#1da1f2] hover:bg-[#1a8cd8] text-white"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        {shared.twitter ? 'Shared!' : 'X/Twitter'}
                      </Button>
                      <Button
                        onClick={() => handleShare('whatsapp')}
                        className="bg-[#25d366] hover:bg-[#20bd5a] text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {shared.whatsapp ? 'Shared!' : 'WhatsApp'}
                      </Button>
                      <Button
                        onClick={() => handleShare('instagram')}
                        className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white"
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={copyLink}
                        variant="outline"
                        className="border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] hover:text-white"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Download */}
                  <a href={generatedContent.url} download={`adpiratin-${generatedContent.type}-${Date.now()}.png`}>
                    <Button
                      variant="outline"
                      className="w-full border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setMode(null);
                        setGeneratedContent(null);
                        setShared({});
                      }}
                      variant="ghost"
                      className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]"
                    >
                      Create Another
                    </Button>
                    <Button
                      onClick={onClose}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                    >
                      Done
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Back Button */}
              {mode && !generatedContent && !generating && (
                <Button
                  variant="ghost"
                  onClick={() => setMode(null)}
                  className="w-full text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a] mt-4"
                >
                  Back
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}