import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Upload, ArrowLeft, Coins, Sparkles,
  CheckCircle, XCircle, DollarSign, Leaf, MessageSquare,
  CreditCard, Star, MousePointer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ContentGeneratorPopup from '@/components/content/ContentGeneratorPopup';

const VIOLATION_TYPES = [
  { id: 'fake_price', label: 'Fake Price / Discount', icon: DollarSign, description: 'Inflated "original" price to fake a bigger discount', points: 30 },
  { id: 'greenwashing', label: 'Greenwashing', icon: Leaf, description: 'False or exaggerated eco-friendly claims', points: 35 },
  { id: 'misleading_claims', label: 'Misleading Claims', icon: MessageSquare, description: 'Untrue or deceptive product claims', points: 25 },
  { id: 'hidden_fees', label: 'Hidden Fees', icon: CreditCard, description: 'Undisclosed charges or fees', points: 30 },
  { id: 'fake_reviews', label: 'Fake Reviews', icon: Star, description: 'Fabricated or paid reviews presented as genuine', points: 25 },
  { id: 'dark_pattern', label: 'Dark Pattern', icon: MousePointer, description: 'Manipulative UI/UX design to trick users', points: 35 }
];

const COUNTRIES = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' }
];

export default function ReportAd() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    advertiser: '',
    violation_type: '',
    description: '',
    evidence_url: '',
    screenshot_url: '',
    country: ''
  });
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [mlDetection, setMlDetection] = useState(null);
  const [reportedAdData, setReportedAdData] = useState(null);
  
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const createReportMutation = useMutation({
    mutationFn: async (data) => {
      const violation = VIOLATION_TYPES.find(v => v.id === data.violation_type);
      const points = violation?.points || 25;
      
      // Create report
      await base44.entities.AdReport.create({
        ...data,
        status: 'pending',
        points_awarded: points,
        reporter_anonymous_id: user?.id || `anon_${Math.random().toString(36).substring(7)}`
      });
      
      // Update pirate profile
      if (pirateProfile?.[0]) {
        await base44.entities.PirateUser.update(pirateProfile[0].id, {
          ads_reported: (pirateProfile[0].ads_reported || 0) + 1,
          total_points: (pirateProfile[0].total_points || 0) + points
        });
      }
      
      return points;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries(['pirateProfile']);
      const violation = VIOLATION_TYPES.find(v => v.id === data.violation_type);
      const points = violation?.points || 25;
      const previousProfile = queryClient.getQueryData(['pirateProfile', user?.email]);
      
      if (previousProfile?.[0]) {
        queryClient.setQueryData(['pirateProfile', user?.email], [
          {
            ...previousProfile[0],
            ads_reported: (previousProfile[0].ads_reported || 0) + 1,
            total_points: (previousProfile[0].total_points || 0) + points
          }
        ]);
      }
      
      return { previousProfile };
    },
    onError: (err, variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['pirateProfile', user?.email], context.previousProfile);
      }
    },
    onSuccess: (points) => {
      setEarnedPoints(points);
      setShowSuccess(true);
      setReportedAdData({
        id: Date.now().toString(),
        advertiser: formData.advertiser,
        description: formData.description,
        violationType: selectedViolation?.label,
        screenshotUrl: formData.screenshot_url
      });
      queryClient.invalidateQueries(['pirateProfile']);
      queryClient.invalidateQueries(['userReports']);
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, screenshot_url: file_url }));
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleSubmit = () => {
    createReportMutation.mutate(formData);
  };

  const selectedViolation = VIOLATION_TYPES.find(v => v.id === formData.violation_type);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CheckCircle className="w-12 h-12 text-[#0a1628]" />
          </motion.div>
          
          <h1 className="text-3xl font-black text-white mb-2">BUSTED! 🏴‍☠️</h1>
          <p className="text-[#8ba3c7] mb-6">You've successfully reported a shady ad!</p>
          
          <motion.div
            className="bg-[#1a2d4a]/50 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-6 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-[#d4af37]" />
              <span className="text-4xl font-black text-[#d4af37]">+{earnedPoints}</span>
            </div>
            <p className="text-[#8ba3c7] text-sm">Pirate Points Earned!</p>
          </motion.div>

          <p className="text-[#5a7a9a] text-sm mb-6">
            Our crew will verify this report. If confirmed, you may earn bonus points!
          </p>

          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-bold">Turn this lie into content?</h3>
            </div>
            <p className="text-[#8ba3c7] text-sm mb-3">
              Generate viral memes or shorts to expose this ad publicly. Earn bonus points for sharing!
            </p>
            <Button 
              onClick={() => setShowContentGenerator(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </motion.div>

          <div className="flex gap-3 justify-center">
            <Link to={createPageUrl('Dashboard')}>
              <Button className="bg-[#1a2d4a] hover:bg-[#2a4a6a] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Ship
              </Button>
            </Link>
            <Button 
              onClick={() => { setShowSuccess(false); setStep(1); setFormData({ advertiser: '', violation_type: '', description: '', evidence_url: '', screenshot_url: '', country: '' }); setReportedAdData(null); }}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
            >
              Report Another
            </Button>
          </div>

          <ContentGeneratorPopup
            isOpen={showContentGenerator}
            onClose={() => setShowContentGenerator(false)}
            adData={reportedAdData}
            onPointsEarned={(points) => {
              setEarnedPoints(prev => prev + points);
              if (pirateProfile?.[0]) {
                base44.entities.PirateUser.update(pirateProfile[0].id, {
                  total_points: (pirateProfile[0].total_points || 0) + points
                });
                queryClient.invalidateQueries(['pirateProfile']);
              }
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-2xl font-black text-white">Report Ad Violation</h1>
            <p className="text-[#8ba3c7] text-sm">Help us bust shady advertisers</p>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s 
                    ? 'bg-gradient-to-br from-[#d4af37] to-[#b8962e] text-[#0a1628]' 
                    : 'bg-[#1a2d4a] text-[#5a7a9a]'
                }`}
                animate={{ scale: step === s ? 1.1 : 1 }}
              >
                {s}
              </motion.div>
              {s < 3 && (
                <div className={`flex-1 h-1 rounded ${step > s ? 'bg-[#d4af37]' : 'bg-[#1a2d4a]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Violation Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#d4af37]" />
                    What type of violation?
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {VIOLATION_TYPES.map((violation) => (
                    <motion.div
                      key={violation.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.violation_type === violation.id
                          ? 'bg-[#d4af37]/10 border-[#d4af37]/50'
                          : 'bg-[#0a1628]/50 border-[#2a4a6a]/30 hover:border-[#d4af37]/30'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, violation_type: violation.id }))}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          formData.violation_type === violation.id ? 'bg-[#d4af37]/20' : 'bg-[#1a2d4a]'
                        }`}>
                          <violation.icon className={`w-5 h-5 ${
                            formData.violation_type === violation.id ? 'text-[#d4af37]' : 'text-[#8ba3c7]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white font-semibold">{violation.label}</h3>
                            <Badge className="bg-[#d4af37]/20 text-[#d4af37] text-xs">
                              +{violation.points} pts
                            </Badge>
                          </div>
                          <p className="text-[#8ba3c7] text-sm mt-1">{violation.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!formData.violation_type}
                    className="mt-4 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
                <CardHeader>
                  <CardTitle className="text-white">Tell us more</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-[#8ba3c7]">Advertiser / Brand Name</Label>
                    <Input 
                      placeholder="e.g., Zalando, Amazon, eBay..."
                      value={formData.advertiser}
                      onChange={(e) => setFormData(prev => ({ ...prev, advertiser: e.target.value }))}
                      className="bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-[#8ba3c7]">Ad URL (optional)</Label>
                    <Input 
                      placeholder="https://..."
                      value={formData.evidence_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, evidence_url: e.target.value }))}
                      className="bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-[#8ba3c7]">Country</Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                    >
                      <SelectTrigger className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                        {COUNTRIES.map((country) => (
                          <SelectItem 
                            key={country.code} 
                            value={country.code}
                            className="text-white hover:bg-[#2a4a6a] focus:bg-[#2a4a6a]"
                          >
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-[#8ba3c7]">Describe the violation</Label>
                    <Textarea 
                      placeholder="What makes this ad misleading or violating DSA rules?"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] mt-1 min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => setStep(3)}
                      disabled={!formData.advertiser || !formData.description}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Evidence & Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="w-5 h-5 text-[#1e90ff]" />
                    Add Evidence (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-[#2a4a6a] rounded-xl p-8 text-center">
                    {formData.screenshot_url ? (
                      <div className="space-y-3">
                        <img 
                          src={formData.screenshot_url} 
                          alt="Screenshot" 
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <Button 
                          variant="ghost" 
                          onClick={() => setFormData(prev => ({ ...prev, screenshot_url: '' }))}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-[#5a7a9a] mx-auto mb-3" />
                        <p className="text-[#8ba3c7] mb-3">Upload a screenshot of the ad</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <label htmlFor="screenshot-upload">
                          <Button 
                            as="span" 
                            variant="outline" 
                            className="border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] cursor-pointer"
                            disabled={uploading}
                          >
                            {uploading ? 'Uploading...' : 'Choose File'}
                          </Button>
                        </label>
                      </>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-[#0a1628]/50 rounded-xl p-4 space-y-2">
                    <h4 className="text-white font-semibold mb-3">Report Summary</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8ba3c7]">Advertiser</span>
                      <span className="text-white">{formData.advertiser}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8ba3c7]">Violation</span>
                      <span className="text-white">{selectedViolation?.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#8ba3c7]">Country</span>
                      <span className="text-white">{COUNTRIES.find(c => c.code === formData.country)?.flag} {formData.country}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-[#2a4a6a]">
                      <span className="text-[#d4af37] font-semibold">Points Reward</span>
                      <span className="text-[#d4af37] font-bold">+{selectedViolation?.points || 25}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={createReportMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:opacity-90"
                    >
                      {createReportMutation.isPending ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          BUST THIS AD!
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}