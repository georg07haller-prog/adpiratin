import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Image, Upload, Wand2, Download, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import html2canvas from 'html2canvas';

const MEME_TEMPLATES = [
  { id: 'drake', name: 'Drake Hotline', layout: 'two-panel' },
  { id: 'distracted', name: 'Distracted Boyfriend', layout: 'three-panel' },
  { id: 'pirate', name: 'Pirate Captain', layout: 'single' },
  { id: 'thinking', name: 'Galaxy Brain', layout: 'four-panel' }
];

export default function EnhancedMemeGenerator() {
  const [meme, setMeme] = useState({
    template: 'pirate',
    topText: '',
    bottomText: '',
    customImage: null
  });
  const [generating, setGenerating] = useState(false);
  const memeRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setMeme(prev => ({ ...prev, customImage: file_url }));
  };

  const generateAIMeme = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a funny but impactful meme text about deceptive advertising or DSA violations. 
        Format: Two lines - top text and bottom text. Make it viral and shareable.
        Theme: Fight against fake discounts, greenwashing, or hidden fees.`,
        response_json_schema: {
          type: 'object',
          properties: {
            topText: { type: 'string' },
            bottomText: { type: 'string' }
          }
        }
      });
      
      setMeme(prev => ({ ...prev, topText: result.topText, bottomText: result.bottomText }));
    } catch (err) {
      console.error('AI generation failed:', err);
    }
    setGenerating(false);
  };

  const downloadMeme = async () => {
    if (!memeRef.current) return;
    const canvas = await html2canvas(memeRef.current);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adpiratin-meme.png';
    a.click();
  };

  const shareMeme = async () => {
    if (!memeRef.current) return;
    const canvas = await html2canvas(memeRef.current);
    canvas.toBlob(async (blob) => {
      if (navigator.share) {
        await navigator.share({
          files: [new File([blob], 'meme.png', { type: 'image/png' })],
          text: 'Made with AdPiratin - Fighting deceptive ads!'
        });
      }
    });
  };

  return (
    <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Image className="w-5 h-5 text-purple-400" />
          Enhanced Meme Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-[#8ba3c7]">Meme Template</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {MEME_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setMeme(prev => ({ ...prev, template: template.id }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  meme.template === template.id
                    ? 'border-[#d4af37] bg-[#d4af37]/10'
                    : 'border-[#2a4a6a] hover:border-[#d4af37]/50'
                }`}
              >
                <p className="text-white text-sm font-medium">{template.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-[#8ba3c7]">Custom Image</Label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="meme-image"
            />
            <label htmlFor="meme-image">
              <Button
                as="span"
                variant="outline"
                className="w-full border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-[#8ba3c7]">Top Text</Label>
            <Input
              value={meme.topText}
              onChange={(e) => setMeme(prev => ({ ...prev, topText: e.target.value }))}
              placeholder="ADS WITH FAKE DISCOUNTS"
              className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
            />
          </div>
          <Button
            size="icon"
            onClick={generateAIMeme}
            disabled={generating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mt-6"
          >
            <Wand2 className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <Label className="text-[#8ba3c7]">Bottom Text</Label>
          <Input
            value={meme.bottomText}
            onChange={(e) => setMeme(prev => ({ ...prev, bottomText: e.target.value }))}
            placeholder="GET REKT BY ADPIRATIN"
            className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
          />
        </div>

        {/* Meme Preview */}
        <div ref={memeRef} className="relative aspect-square bg-black rounded-lg overflow-hidden">
          {meme.customImage ? (
            <img src={meme.customImage} alt="Meme" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a2d4a] to-[#0a1628] flex items-center justify-center">
              <Image className="w-24 h-24 text-[#5a7a9a]" />
            </div>
          )}
          {meme.topText && (
            <div className="absolute top-4 left-0 right-0 text-center">
              <p className="text-white font-black text-2xl md:text-4xl uppercase px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0)]">
                {meme.topText}
              </p>
            </div>
          )}
          {meme.bottomText && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white font-black text-2xl md:text-4xl uppercase px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_0_rgb(0_0_0)]">
                {meme.bottomText}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={downloadMeme}
            disabled={!meme.topText && !meme.bottomText}
            className="flex-1 bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={shareMeme}
            disabled={!meme.topText && !meme.bottomText}
            className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share (+10 pts)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}