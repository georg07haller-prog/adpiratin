import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Send, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const MOCK_POSTS = [
  {
    id: 1,
    author: 'CaptainBlackbeard',
    rank: 'Treasure Hunter',
    text: 'Pro tip: Always check Idealo.de before buying anything on Amazon. Saved €200 last month! 💰',
    likes: 47,
    timestamp: '2h ago'
  },
  {
    id: 2,
    author: 'SilentSniper_99',
    rank: 'Sly Sniper',
    text: 'Found Zalando selling "eco-friendly" shoes made in sweatshops. Reported! DSA will handle them. 🏴‍☠️',
    likes: 89,
    timestamp: '5h ago'
  },
  {
    id: 3,
    author: 'DealHunterPro',
    rank: 'Crew Mate',
    text: 'Anyone else notice fake reviews on MediaMarkt? Use Fakespot extension to verify!',
    likes: 34,
    timestamp: '1d ago'
  }
];

export default function Tavern({ username, userRank }) {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error('Write something first!');
      return;
    }

    const post = {
      id: Date.now(),
      author: username || 'Anonymous Pirate',
      rank: userRank || 'Deck Swabber',
      text: newPost,
      likes: 0,
      timestamp: 'Just now'
    };

    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Posted to tavern!');
  };

  const handleLike = (postId) => {
    if (likedPosts.has(postId)) return;

    setPosts(posts.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ));
    setLikedPosts(new Set([...likedPosts, postId]));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#d4af37]" />
          Pirate Tavern
        </h3>
        <Badge className="bg-green-500/20 text-green-400">
          <Users className="w-3 h-3 mr-1" />
          247 pirates online
        </Badge>
      </div>

      {/* New Post */}
      <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Share your hunt hacks..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePost()}
              className="bg-[#0a1628] border-[#2a4a6a] text-white placeholder:text-[#5a7a9a]"
            />
            <Button
              onClick={handlePost}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center shrink-0">
                    <span className="text-lg">🏴‍☠️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">{post.author}</span>
                      <Badge className="bg-[#1e90ff]/20 text-[#1e90ff] text-xs">
                        {post.rank}
                      </Badge>
                      <span className="text-[#5a7a9a] text-xs ml-auto">{post.timestamp}</span>
                    </div>
                    <p className="text-[#c4d4e4] text-sm mb-3">{post.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      disabled={likedPosts.has(post.id)}
                      className={`text-xs ${
                        likedPosts.has(post.id) 
                          ? 'text-[#d4af37]' 
                          : 'text-[#8ba3c7] hover:text-[#d4af37]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {post.likes}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#0a1628]/50 rounded-xl border border-[#2a4a6a]/30 text-center">
        <p className="text-[#5a7a9a] text-sm">
          🚧 Real-time chat coming Q2 2026. For now, share your best hunt hacks!
        </p>
      </div>
    </div>
  );
}