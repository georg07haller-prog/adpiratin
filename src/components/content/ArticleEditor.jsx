import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { FileText, Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ArticleEditor() {
  const [article, setArticle] = useState({
    title: '',
    subtitle: '',
    body: '',
    tags: ''
  });
  const [generating, setGenerating] = useState(false);

  const generateWithAI = async () => {
    if (!article.title) return;
    
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a compelling article about deceptive advertising practices. Title: "${article.title}". 
        The article should:
        - Expose specific DSA violations or dark patterns
        - Use data and examples
        - Maintain a pirate-themed activist tone
        - End with a call to action
        Format: Professional but engaging, 500-800 words.`,
        add_context_from_internet: true
      });
      
      setArticle(prev => ({ ...prev, body: result }));
    } catch (err) {
      console.error('AI generation failed:', err);
    }
    setGenerating(false);
  };

  const exportArticle = () => {
    const content = `# ${article.title}\n\n## ${article.subtitle}\n\n${article.body}\n\n---\nTags: ${article.tags}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
  };

  const shareArticle = async () => {
    const text = `${article.title}\n\n${article.subtitle}\n\nRead more on AdPiratin`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Article Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-[#8ba3c7]">Title</Label>
          <Input
            value={article.title}
            onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
            placeholder="How Brand X Deceives EU Consumers"
            className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
          />
        </div>

        <div>
          <Label className="text-[#8ba3c7]">Subtitle</Label>
          <Input
            value={article.subtitle}
            onChange={(e) => setArticle(prev => ({ ...prev, subtitle: e.target.value }))}
            placeholder="A deep dive into DSA violations and hidden fees"
            className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-[#8ba3c7]">Body</Label>
            <Button
              size="sm"
              onClick={generateWithAI}
              disabled={!article.title || generating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'AI Assist'}
            </Button>
          </div>
          <Textarea
            value={article.body}
            onChange={(e) => setArticle(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Write your article content here..."
            className="bg-[#0a1628] border-[#2a4a6a] text-white min-h-[300px]"
          />
          <p className="text-[#5a7a9a] text-xs mt-1">
            {article.body.length} characters • {Math.ceil(article.body.split(' ').length / 200)} min read
          </p>
        </div>

        <div>
          <Label className="text-[#8ba3c7]">Tags</Label>
          <Input
            value={article.tags}
            onChange={(e) => setArticle(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="DSA, greenwashing, hidden-fees"
            className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={exportArticle}
            disabled={!article.title || !article.body}
            className="flex-1 bg-[#1e90ff] hover:bg-[#1e90ff]/80 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={shareArticle}
            disabled={!article.title}
            className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share (+15 pts)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}