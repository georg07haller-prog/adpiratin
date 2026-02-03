import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, FileText, Video, Target, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CONTENT_TYPES = [
  { id: 'meme', label: 'Meme', icon: Image, color: 'from-purple-500 to-pink-500' },
  { id: 'article', label: 'Article', icon: FileText, color: 'from-blue-500 to-cyan-500' },
  { id: 'video', label: 'Video', icon: Video, color: 'from-red-500 to-orange-500' },
  { id: 'expose', label: 'Exposé', icon: Target, color: 'from-orange-500 to-red-500' }
];

export default function ContentCreator({ isOpen, onClose, clanId, userEmail }) {
  const [formData, setFormData] = useState({
    content_type: 'meme',
    title: '',
    description: '',
    body: '',
    media_url: '',
    visibility: 'clan_only',
    tags: []
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const createContentMutation = useMutation({
    mutationFn: (data) => base44.entities.ClanContent.create({
      ...data,
      clan_id: clanId,
      creator_email: userEmail,
      likes: 0,
      shares: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clanContent']);
      onClose();
      setFormData({
        content_type: 'meme',
        title: '',
        description: '',
        body: '',
        media_url: '',
        visibility: 'clan_only',
        tags: []
      });
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, media_url: file_url }));
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const selectedType = CONTENT_TYPES.find(t => t.id === formData.content_type);

  return (
    <AnimatePresence>
      {isOpen && (
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
            <Card className="bg-[#1a2d4a] border-[#2a4a6a]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {selectedType && <selectedType.icon className="w-5 h-5" />}
                    Create Clan Content
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-[#8ba3c7]">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#8ba3c7]">Content Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {CONTENT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormData(prev => ({ ...prev, content_type: type.id }))}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.content_type === type.id
                            ? 'border-[#d4af37] bg-[#d4af37]/10'
                            : 'border-[#2a4a6a] hover:border-[#d4af37]/50'
                        }`}
                      >
                        <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                          formData.content_type === type.id ? 'text-[#d4af37]' : 'text-[#8ba3c7]'
                        }`} />
                        <p className="text-white text-sm font-medium">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-[#8ba3c7]">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your content a catchy title"
                    className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[#8ba3c7]">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your content"
                    className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
                  />
                </div>

                {(formData.content_type === 'article' || formData.content_type === 'expose') && (
                  <div>
                    <Label className="text-[#8ba3c7]">Body Content</Label>
                    <Textarea
                      value={formData.body}
                      onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                      placeholder="Write your full article or exposé here..."
                      className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1 min-h-[200px]"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-[#8ba3c7]">Media {formData.content_type === 'meme' && '(Required)'}</Label>
                  {formData.media_url ? (
                    <div className="relative mt-2">
                      <img src={formData.media_url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFormData(prev => ({ ...prev, media_url: '' }))}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="content-upload"
                      />
                      <label htmlFor="content-upload">
                        <Button
                          as="span"
                          variant="outline"
                          className="w-full border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] cursor-pointer"
                          disabled={uploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload Media'}
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-[#8ba3c7]">Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(val) => setFormData(prev => ({ ...prev, visibility: val }))}>
                    <SelectTrigger className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                      <SelectItem value="clan_only" className="text-white">Clan Only</SelectItem>
                      <SelectItem value="public" className="text-white">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1 text-[#8ba3c7] hover:text-white hover:bg-[#0a1628]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => createContentMutation.mutate(formData)}
                    disabled={!formData.title || (formData.content_type === 'meme' && !formData.media_url) || createContentMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold"
                  >
                    {createContentMutation.isPending ? 'Creating...' : 'Create Content'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}