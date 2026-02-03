import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flag, ArrowLeft, Users, Trophy, Target, Plus,
  MessageSquare, Calendar, Image, FileText, Video,
  TrendingUp, Award, Crown, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentCreator from '@/components/clan/ContentCreator';
import EventManager from '@/components/clan/EventManager';
import DiscussionForum from '@/components/clan/DiscussionForum';
import ClanStats from '@/components/clan/ClanStats';

export default function ClanHub() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const { data: userClan } = useQuery({
    queryKey: ['userClan', user?.email],
    queryFn: async () => {
      const userClans = await base44.entities.Clan.filter({ members: user?.email });
      return userClans[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: clanContent = [] } = useQuery({
    queryKey: ['clanContent', userClan?.id],
    queryFn: () => base44.entities.ClanContent.filter({ clan_id: userClan?.id }, '-created_date', 20),
    enabled: !!userClan?.id
  });

  const { data: clanEvents = [] } = useQuery({
    queryKey: ['clanEvents', userClan?.id],
    queryFn: () => base44.entities.ClanEvent.filter({ clan_id: userClan?.id }, '-created_date', 10),
    enabled: !!userClan?.id
  });

  const { data: clanDiscussions = [] } = useQuery({
    queryKey: ['clanDiscussions', userClan?.id],
    queryFn: () => base44.entities.ClanDiscussion.filter({ clan_id: userClan?.id }, '-created_date', 15),
    enabled: !!userClan?.id
  });

  if (!userClan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8 flex items-center justify-center">
        <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 max-w-md">
          <CardContent className="p-8 text-center">
            <Flag className="w-16 h-16 text-[#5a7a9a] mx-auto mb-4" />
            <h2 className="text-white font-bold text-xl mb-2">No Clan Yet</h2>
            <p className="text-[#8ba3c7] mb-6">Join or create a clan to access the Clan Hub</p>
            <Link to={createPageUrl('Clans')}>
              <Button className="bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold">
                <Flag className="w-4 h-4 mr-2" />
                Browse Clans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLeader = userClan.leader_email === user?.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to={createPageUrl('Clans')}>
            <Button variant="ghost" className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${userClan.flag_colors} flex items-center justify-center text-2xl`}>
                {userClan.flag_emoji}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  {userClan.name}
                  {isLeader && <Crown className="w-5 h-5 text-[#d4af37]" />}
                </h1>
                <p className="text-[#8ba3c7] text-sm italic">"{userClan.motto}"</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4 text-center">
              <Users className="w-5 h-5 text-[#8ba3c7] mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{userClan.members?.length || 0}</p>
              <p className="text-[#8ba3c7] text-xs">Members</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4 text-center">
              <Target className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{userClan.total_exposes || 0}</p>
              <p className="text-[#8ba3c7] text-xs">Exposés</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4 text-center">
              <Trophy className="w-5 h-5 text-[#d4af37] mx-auto mb-2" />
              <p className="text-2xl font-black text-[#d4af37]">{userClan.total_points?.toLocaleString() || 0}</p>
              <p className="text-[#8ba3c7] text-xs">Points</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardContent className="p-4 text-center">
              <Award className="w-5 h-5 text-[#1e90ff] mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{userClan.achievements?.length || 0}</p>
              <p className="text-[#8ba3c7] text-xs">Achievements</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 bg-[#1a2d4a]/50 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1628]">
                <Flag className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1628]">
                <Image className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1628]">
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="forum" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1628]">
                <MessageSquare className="w-4 h-4 mr-2" />
                Forum
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ClanStats clan={userClan} />
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-bold text-lg">Clan Content</h3>
                  <Button
                    onClick={() => setShowContentCreator(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
                <ContentCreator
                  isOpen={showContentCreator}
                  onClose={() => setShowContentCreator(false)}
                  clanId={userClan.id}
                  userEmail={user?.email}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  {clanContent.map((content) => (
                    <Card key={content.id} className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50 hover:border-[#d4af37]/30 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge className={`${
                            content.content_type === 'meme' ? 'bg-purple-500/20 text-purple-400' :
                            content.content_type === 'article' ? 'bg-blue-500/20 text-blue-400' :
                            content.content_type === 'video' ? 'bg-red-500/20 text-red-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {content.content_type}
                          </Badge>
                          <Badge variant="outline" className="border-[#2a4a6a] text-[#8ba3c7]">
                            {content.visibility}
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-base mt-2">{content.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {content.media_url && (
                          <img src={content.media_url} alt={content.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                        )}
                        <p className="text-[#8ba3c7] text-sm line-clamp-2 mb-3">{content.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#8ba3c7]">❤️ {content.likes || 0}</span>
                          <span className="text-[#8ba3c7]">🔗 {content.shares || 0}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {clanContent.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                      <Image className="w-16 h-16 text-[#5a7a9a] mx-auto mb-4" />
                      <p className="text-[#8ba3c7]">No content yet. Be the first to create!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <EventManager
                clanId={userClan.id}
                isLeader={isLeader}
                userEmail={user?.email}
              />
            </TabsContent>

            <TabsContent value="forum">
              <DiscussionForum
                clanId={userClan.id}
                userEmail={user?.email}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}