import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, ThumbsUp, Pin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = [
  { id: 'general', label: 'General', color: 'bg-gray-500/20 text-gray-400' },
  { id: 'strategy', label: 'Strategy', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'announcements', label: 'Announcements', color: 'bg-purple-500/20 text-purple-400' },
  { id: 'help', label: 'Help', color: 'bg-green-500/20 text-green-400' },
  { id: 'achievements', label: 'Achievements', color: 'bg-yellow-500/20 text-yellow-400' }
];

export default function DiscussionForum({ clanId, userEmail }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const queryClient = useQueryClient();

  const { data: discussions = [] } = useQuery({
    queryKey: ['clanDiscussions', clanId],
    queryFn: () => base44.entities.ClanDiscussion.filter({ clan_id: clanId }, '-created_date', 15),
    enabled: !!clanId
  });

  const createDiscussionMutation = useMutation({
    mutationFn: (data) => base44.entities.ClanDiscussion.create({
      ...data,
      clan_id: clanId,
      author_email: userEmail,
      replies: [],
      likes: 0,
      pinned: false
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clanDiscussions']);
      setShowForm(false);
      setFormData({ title: '', content: '', category: 'general' });
    }
  });

  const replyMutation = useMutation({
    mutationFn: ({ discussionId, replies, newReply }) =>
      base44.entities.ClanDiscussion.update(discussionId, {
        replies: [...replies, { ...newReply, timestamp: new Date().toISOString() }]
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clanDiscussions']);
      setReplyContent('');
    }
  });

  const likeMutation = useMutation({
    mutationFn: ({ discussionId, currentLikes }) =>
      base44.entities.ClanDiscussion.update(discussionId, { likes: currentLikes + 1 }),
    onSuccess: () => queryClient.invalidateQueries(['clanDiscussions'])
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Forum Discussions</h3>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Topic
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-[#8ba3c7]">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's on your mind?"
                className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-[#8ba3c7]">Category</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}>
                <SelectTrigger className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2d4a] border-[#2a4a6a]">
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white">{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#8ba3c7]">Content</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                className="bg-[#0a1628] border-[#2a4a6a] text-white mt-1 min-h-[120px]"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowForm(false)} className="flex-1 text-[#8ba3c7]">
                Cancel
              </Button>
              <Button
                onClick={() => createDiscussionMutation.mutate(formData)}
                disabled={!formData.title || !formData.content || createDiscussionMutation.isPending}
                className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold"
              >
                {createDiscussionMutation.isPending ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {discussions.map((discussion) => {
          const category = CATEGORIES.find(c => c.id === discussion.category);
          const isExpanded = selectedDiscussion === discussion.id;

          return (
            <motion.div key={discussion.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all">
                <CardHeader className="pb-3 cursor-pointer" onClick={() => setSelectedDiscussion(isExpanded ? null : discussion.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.pinned && <Pin className="w-4 h-4 text-[#d4af37]" />}
                        <Badge className={category?.color}>{category?.label}</Badge>
                      </div>
                      <CardTitle className="text-white text-base">{discussion.title}</CardTitle>
                      <p className="text-[#8ba3c7] text-sm mt-2">{discussion.content}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeMutation.mutate({ discussionId: discussion.id, currentLikes: discussion.likes || 0 })}
                      className="text-[#8ba3c7] hover:text-[#d4af37]"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {discussion.likes || 0}
                    </Button>
                    <span className="flex items-center gap-1 text-[#8ba3c7]">
                      <MessageSquare className="w-4 h-4" />
                      {discussion.replies?.length || 0} replies
                    </span>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      {discussion.replies?.map((reply, i) => (
                        <div key={i} className="bg-[#0a1628]/50 rounded-lg p-3">
                          <p className="text-white text-sm mb-1">{reply.content}</p>
                          <p className="text-[#5a7a9a] text-xs">{new Date(reply.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="bg-[#0a1628] border-[#2a4a6a] text-white"
                        />
                        <Button
                          onClick={() => replyMutation.mutate({
                            discussionId: discussion.id,
                            replies: discussion.replies || [],
                            newReply: { author_email: userEmail, content: replyContent }
                          })}
                          disabled={!replyContent || replyMutation.isPending}
                          size="icon"
                          className="bg-[#d4af37] hover:bg-[#b8962e]"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {discussions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-[#5a7a9a] mx-auto mb-4" />
            <p className="text-[#8ba3c7]">No discussions yet. Start one!</p>
          </div>
        )}
      </div>
    </div>
  );
}