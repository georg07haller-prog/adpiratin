import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Video, Sparkles, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VIDEO_FORMATS = [
  { id: 'tiktok', label: 'TikTok/Reels (15-60s)', duration: 30 },
  { id: 'youtube-short', label: 'YouTube Short (60s)', duration: 60 },
  { id: 'instagram', label: 'Instagram Reel (90s)', duration: 90 }
];

export default function VideoScriptGenerator() {
  const [script, setScript] = useState({
    topic: '',
    format: 'tiktok',
    tone: 'humorous',
    generatedScript: ''
  });
  const [generating, setGenerating] = useState(false);

  const generateScript = async () => {
    if (!script.topic) return;
    
    setGenerating(true);
    try {
      const format = VIDEO_FORMATS.find(f => f.id === script.format);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a ${format.duration}-second video script about: "${script.topic}"
        
        Requirements:
        - Tone: ${script.tone}
        - Format: ${format.label}
        - Theme: Expose deceptive advertising, DSA violations, or consumer manipulation
        - Include: Hook (first 3 seconds), main content, call to action
        - Add timestamps and shot suggestions
        - Make it engaging and shareable
        
        Format the script with:
        [00:00] HOOK: ...
        [00:03] SCENE: ...
        etc.`,
        add_context_from_internet: true
      });
      
      setScript(prev => ({ ...prev, generatedScript: result }));
    } catch (err) {
      console.error('Script generation failed:', err);
    }
    setGenerating(false);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script.generatedScript);
    alert('Script copied to clipboard!');
  };

  const downloadScript = () => {
    const blob = new Blob([script.generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.topic.replace(/\s+/g, '-').toLowerCase()}-script.txt`;
    a.click();
  };

  return (
    <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-red-400" />
          Video Script Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-[#8ba3c7]">Video Topic</Label>
          <Input
            value={script.topic}
            onChange={(e) => setScript(prev => ({ ...prev, topic: e.target.value }))}
            placeholder="Exposing fake Black Friday discounts"
            className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#8ba3c7]">Format</Label>
            <Select value={script.format} onValueChange={(val) => setScript(prev => ({ ...prev, format: val }))}>
              <SelectTrigger className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                {VIDEO_FORMATS.map(format => (
                  <SelectItem key={format.id} value={format.id} className="text-white">
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[#8ba3c7]">Tone</Label>
            <Select value={script.tone} onValueChange={(val) => setScript(prev => ({ ...prev, tone: val }))}>
              <SelectTrigger className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                <SelectItem value="humorous" className="text-white">Humorous</SelectItem>
                <SelectItem value="serious" className="text-white">Serious</SelectItem>
                <SelectItem value="educational" className="text-white">Educational</SelectItem>
                <SelectItem value="aggressive" className="text-white">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={generateScript}
          disabled={!script.topic || generating}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {generating ? 'Generating Script...' : 'Generate Script'}
        </Button>

        {script.generatedScript && (
          <>
            <div>
              <Label className="text-[#8ba3c7]">Generated Script</Label>
              <Textarea
                value={script.generatedScript}
                onChange={(e) => setScript(prev => ({ ...prev, generatedScript: e.target.value }))}
                className="bg-[#0a1628] border-[#2a4a6a] text-white min-h-[400px] mt-1 font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={copyScript}
                className="flex-1 bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={downloadScript}
                className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]"
              >
                <Download className="w-4 h-4 mr-2" />
                Download (+20 pts)
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}