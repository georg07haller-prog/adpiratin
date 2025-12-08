import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, ArrowLeft, Sparkles, Twitter, Download, Copy,
  Image, Skull, Loader2, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const MEME_TEMPLATES = [
  { id: 'busted', text: 'I busted {brand}\'s fake {type}! 🏴‍☠️', color: 'from-red-500 to-orange-500' },
  { id: 'found', text: 'Found a better deal than {brand}! Save {percent}%! 💰', color: 'from-green-500 to-emerald-500' },
  { id: 'pirate', text: 'Arrr! {brand} tried to scam me, but I\'m an AdPiratin! ⚔️', color: 'from-[#1e90ff] to-cyan-400' },
  { id: 'dsa', text: 'DSA 2025 says NO to {brand}\'s misleading ads! 🛡️', color: 'from-purple-500 to-pink-500' }
];

const VIOLATION_TYPES = ['fake discount', 'greenwashing', 'hidden fees', 'dark pattern', 'fake reviews'];

export default function MemeGenerator() {
  const [user, setUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(MEME_TEMPLATES[0]);
  const [brandName, setBrandName] = useState('');
  const [violationType, setViolationType] = useState('fake discount');
  const [savePercent, setSavePercent] = useState('50');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedText, setGeneratedText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const generateFinalText = () => {
    let text = selectedTemplate.text;
    text = text.replace('{brand}', brandName || 'Big Brand');
    text = text.replace('{type}', violationType);
    text = text.replace('{percent}', savePercent);
    return text;
  };

  const generateMeme = async () => {
    if (!brandName) {
      toast.error('Please enter a brand name');
      return;
    }
    
    setGenerating(true);
    const text = generateFinalText();
    setGeneratedText(text);
    
    try {
      // Generate image using AI
      const { url } = await base44.integrations.Core.GenerateImage({
        prompt: `Create a bold, eye-catching social media meme image in pirate theme. 
        Style: vibrant deep blue and gold colors, pirate aesthetic with a modern twist.
        Include: A dramatic pirate flag with skull, golden coins scattered, maybe a ship silhouette.
        Text overlay space at center for: "${text}"
        Make it look like a viral social media share image for consumer protection awareness.
        Professional quality, suitable for Twitter/X share.`
      });
      
      setGeneratedImage(url);
      
      // Award points
      if (pirateProfile?.[0]) {
        await base44.entities.PirateUser.update(pirateProfile[0].id, {
          total_points: (pirateProfile[0].total_points || 0) + 5
        });
        queryClient.invalidateQueries(['pirateProfile']);
      }
      
      toast.success('+5 Pirate Points earned!');
    } catch (err) {
      console.error('Generation failed:', err);
      toast.error('Failed to generate meme');
    }
    
    setGenerating(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${generatedText}\n\n#AdPiratin #DSA2025 #FairPrices #StopFakeAds`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(`${generatedText}\n\n#AdPiratin #DSA2025 #FairPrices`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
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
            <h1 className="text-2xl font-black text-white">Meme Generator</h1>
            <p className="text-[#8ba3c7] text-sm">Create & share your ad-busting victories</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="w-5 h-5 text-[#d4af37]" />
                  Create Your Meme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Selection */}
                <div>
                  <Label className="text-[#8ba3c7]">Choose Template</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {MEME_TEMPLATES.map((template) => (
                      <motion.div
                        key={template.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedTemplate.id === template.id
                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                            : 'border-[#2a4a6a] hover:border-[#d4af37]/50'
                        }`}
                        onClick={() => setSelectedTemplate(template)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-full h-2 rounded bg-gradient-to-r ${template.color} mb-2`} />
                        <p className="text-[#8ba3c7] text-xs line-clamp-2">{template.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Brand Name */}
                <div>
                  <Label className="text-[#8ba3c7]">Brand Name</Label>
                  <Input 
                    placeholder="e.g., Zalando, Amazon..."
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] mt-1"
                  />
                </div>

                {/* Violation Type */}
                {selectedTemplate.text.includes('{type}') && (
                  <div>
                    <Label className="text-[#8ba3c7]">Violation Type</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {VIOLATION_TYPES.map((type) => (
                        <Badge
                          key={type}
                          className={`cursor-pointer transition-all ${
                            violationType === type
                              ? 'bg-[#d4af37] text-[#0a1628]'
                              : 'bg-[#1a2d4a] text-[#8ba3c7] hover:bg-[#2a4a6a]'
                          }`}
                          onClick={() => setViolationType(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Percent */}
                {selectedTemplate.text.includes('{percent}') && (
                  <div>
                    <Label className="text-[#8ba3c7]">Savings %</Label>
                    <Input 
                      type="number"
                      placeholder="50"
                      value={savePercent}
                      onChange={(e) => setSavePercent(e.target.value)}
                      className="bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] mt-1 w-24"
                    />
                  </div>
                )}

                {/* Preview Text */}
                <div className="p-4 rounded-xl bg-[#0a1628] border border-[#2a4a6a]">
                  <p className="text-[#8ba3c7] text-xs mb-1">Preview:</p>
                  <p className="text-white font-medium">{generateFinalText()}</p>
                </div>

                <Button 
                  onClick={generateMeme}
                  disabled={generating || !brandName}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Meme (+5 pts)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview & Share */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#1e90ff]" />
                  Preview & Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src={generatedImage} 
                        alt="Generated meme" 
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 max-w-[80%]">
                          <p className="text-white text-center font-bold text-lg">{generatedText}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        onClick={handleShareTwitter}
                        className="bg-[#1da1f2] hover:bg-[#1a8cd8] text-white"
                      >
                        <Twitter className="w-4 h-4 mr-1" />
                        X/Twitter
                      </Button>
                      <Button 
                        onClick={handleCopyText}
                        variant="outline"
                        className="border-[#2a4a6a] text-white hover:bg-[#1a2d4a]"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 mr-1" />
                        )}
                        Copy
                      </Button>
                      <a href={generatedImage} download="adpiratin-meme.png" target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline"
                          className="w-full border-[#2a4a6a] text-white hover:bg-[#1a2d4a]"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </a>
                    </div>

                    <div className="p-3 bg-[#0a1628]/50 rounded-xl">
                      <p className="text-[#8ba3c7] text-xs">Suggested hashtags:</p>
                      <p className="text-[#1e90ff] text-sm mt-1">
                        #AdPiratin #DSA2025 #FairPrices #StopFakeAds #ConsumerRights
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#0a1628] rounded-full flex items-center justify-center">
                      <Skull className="w-10 h-10 text-[#5a7a9a]" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Ready to Create!</h3>
                    <p className="text-[#8ba3c7] text-sm">
                      Fill in the details and generate your meme to share your ad-busting victory!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}