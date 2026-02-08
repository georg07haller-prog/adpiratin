import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Shield, Zap, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeImageForViolations, getPrivacyStatus } from '@/lib/mlDetection';

export default function MLScanner({ onDetection }) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const privacy = getPrivacyStatus();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setScanning(true);
    setResult(null);
    
    try {
      const detection = await analyzeImageForViolations(file);
      setResult(detection);
      onDetection?.(detection);
    } catch (err) {
      console.error('Detection failed:', err);
    }
    
    setScanning(false);
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Scan className="w-5 h-5 text-purple-400" />
            AI Scanner (On-Device)
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-400">
            <Shield className="w-3 h-3 mr-1" />
            Private
          </Badge>
        </div>
        <p className="text-[#8ba3c7] text-sm mt-1">{privacy.message}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="ml-scanner"
            />
            <label htmlFor="ml-scanner">
              <Button
                as="span"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-pointer"
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Scan Ad Screenshot
                  </>
                )}
              </Button>
            </label>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="p-4 bg-[#1a2d4a]/50 rounded-xl border border-[#2a4a6a]">
                  <div className="flex items-center gap-2 mb-3">
                    {result.confidence > 0.8 ? (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-white font-bold">Detection Result</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8ba3c7]">Violation Type:</span>
                      <span className="text-white font-bold capitalize">
                        {result.violationType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8ba3c7]">Confidence:</span>
                      <span className={`font-bold ${
                        result.confidence > 0.8 ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    {result.extractedText && (
                      <div className="mt-3 pt-3 border-t border-[#2a4a6a]">
                        <span className="text-[#8ba3c7] text-xs">Extracted Text:</span>
                        <p className="text-white mt-1">{result.extractedText}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>Processed locally • No data uploaded</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}