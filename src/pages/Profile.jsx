import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Coins, Trophy, Target, ArrowLeft, 
  Edit2, Shield, Bell, Palette, LogOut, Trash2,
  Crown, Flag, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RANKS = [
  { name: 'Deck Swabber', min: 0, max: 99 },
  { name: 'Crew Mate', min: 100, max: 499 },
  { name: 'Sly Sniper', min: 500, max: 999 },
  { name: 'Captains Cutlass', min: 1000, max: 2499 },
  { name: 'Treasure Hunter', min: 2500, max: 4999 },
  { name: 'Golden Galleon', min: 5000, max: Infinity }
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pirateName, setPirateName] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const profile = pirateProfile?.[0];

  useEffect(() => {
    if (profile?.pirate_name) {
      setPirateName(profile.pirate_name);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.entities.PirateUser.update(profile.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['pirateProfile']);
      setEditing(false);
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.User.delete(user.id);
      base44.auth.logout();
    }
  });

  const currentRank = RANKS.find(r => 
    (profile?.total_points || 0) >= r.min && (profile?.total_points || 0) <= r.max
  ) || RANKS[0];

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
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">Profile & Settings</h1>
            <p className="text-[#8ba3c7] text-sm">Manage your pirate identity</p>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-[#1a2d4a]/80 to-[#0f2137]/80 backdrop-blur-xl border-[#d4af37]/20 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#8b7730] flex items-center justify-center">
                    <Crown className="w-10 h-10 text-[#0a1628]" />
                  </div>
                  <div>
                    {editing ? (
                      <Input
                        value={pirateName}
                        onChange={(e) => setPirateName(e.target.value)}
                        className="bg-[#0a1628] border-[#2a4a6a] text-white mb-2"
                        placeholder="Your pirate name"
                      />
                    ) : (
                      <h2 className="text-white text-2xl font-bold mb-1">
                        {profile?.pirate_name || user?.full_name || 'Pirate'}
                      </h2>
                    )}
                    <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                      {currentRank.name}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (editing) {
                      updateProfileMutation.mutate({ pirate_name: pirateName });
                    } else {
                      setEditing(true);
                    }
                  }}
                  className="text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a]"
                >
                  {editing ? <Sparkles className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[#0a1628]/30 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Coins className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xl font-black text-[#d4af37]">
                      {profile?.total_points?.toLocaleString() || 0}
                    </span>
                  </div>
                  <p className="text-[#8ba3c7] text-xs">Points</p>
                </div>
                <div className="text-center p-3 bg-[#0a1628]/30 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-red-400" />
                    <span className="text-xl font-black text-white">
                      {profile?.ads_reported || 0}
                    </span>
                  </div>
                  <p className="text-[#8ba3c7] text-xs">Reports</p>
                </div>
                <div className="text-center p-3 bg-[#0a1628]/30 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-4 h-4 text-[#1e90ff]" />
                    <span className="text-xl font-black text-white">
                      {profile?.ads_killed || 0}
                    </span>
                  </div>
                  <p className="text-[#8ba3c7] text-xs">Busted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardHeader>
              <CardTitle className="text-white text-sm">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#8ba3c7] text-sm">Email</span>
                <span className="text-white text-sm">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ba3c7] text-sm">Role</span>
                <Badge variant="outline" className="border-[#2a4a6a] text-white">
                  {user?.role === 'admin' ? '👑 Admin' : '🏴‍☠️ Pirate'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-[#1a2d4a]/50 backdrop-blur-xl border-[#2a4a6a]/50">
            <CardHeader>
              <CardTitle className="text-white text-sm">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a] min-h-[44px]"
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
                <Badge className="ml-auto bg-[#1e90ff]/20 text-[#1e90ff]">Coming Soon</Badge>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-[#8ba3c7] hover:text-white hover:bg-[#1a2d4a] min-h-[44px]"
              >
                <Palette className="w-5 h-5 mr-3" />
                Theme
                <span className="ml-auto text-xs text-[#8ba3c7]">System</span>
              </Button>
              {user?.role === 'admin' && (
                <Link to={createPageUrl('AdminPanel')}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-[#1e90ff] hover:text-white hover:bg-[#1a2d4a] min-h-[44px]"
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Admin Panel
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-red-500/5 backdrop-blur-xl border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 text-sm">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => base44.auth.logout()}
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 min-h-[44px]"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 min-h-[44px]"
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a2d4a] border border-red-500/30 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Delete Account</h3>
                  <p className="text-red-400 text-sm">This action is permanent</p>
                </div>
              </div>
              <p className="text-[#8ba3c7] text-sm mb-6">
                Are you absolutely sure? All your pirate points, reports, and clan memberships will be permanently deleted. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border-[#2a4a6a] text-[#8ba3c7] hover:bg-[#1a2d4a] min-h-[44px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteAccountMutation.mutate()}
                  disabled={deleteAccountMutation.isPending}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white min-h-[44px]"
                >
                  {deleteAccountMutation.isPending ? 'Deleting...' : 'Delete Forever'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}