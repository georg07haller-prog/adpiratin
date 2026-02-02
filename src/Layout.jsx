import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, Home, AlertTriangle, Search, Trophy, Share2, 
  BookOpen, Shield, Menu, X, LogOut, User, Coins, Smartphone, Ship, Music, Flag, Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: Home, page: 'Dashboard' },
  { name: 'Report Ad', icon: AlertTriangle, page: 'ReportAd' },
  { name: 'Hunt Deals', icon: Search, page: 'HuntAlternatives' },
  { name: 'Wall of Shame', icon: Skull, page: 'WallOfShamePage', special: true },
  { name: 'Clans', icon: Flag, page: 'Clans', special: true },
  { name: 'Leaderboard', icon: Trophy, page: 'Leaderboard' },
  { name: 'Meme Gen', icon: Share2, page: 'MemeGenerator' },
  { name: 'Anthem', icon: Music, page: 'AnthemPublic', special: true },
  { name: 'NovaLibertalia', icon: Ship, page: 'NovaLibertalia', special: true },
  { name: 'YouTube Live', icon: Youtube, page: 'YouTubeLive', special: true },
  { name: 'DSA Guide', icon: BookOpen, page: 'DSAGuide' },
  { name: 'Extension Demo', icon: Shield, page: 'ExtensionDemo' },
  { name: 'Mobile App', icon: Smartphone, page: 'MobilePreview' },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pirateProfile } = useQuery({
    queryKey: ['pirateProfile', user?.email],
    queryFn: () => base44.entities.PirateUser.filter({ user_email: user?.email }),
    enabled: !!user?.email
  });

  const profile = pirateProfile?.[0];

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0d1a2d]/90 backdrop-blur-xl border-r border-[#1a2d4a] flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[#1a2d4a]">
          <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-xl">
              <Skull className="w-6 h-6 text-[#0a1628]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">AdPiratin</h1>
              <p className="text-[#d4af37] text-xs">Fair winds, fair prices!</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link key={item.name} to={createPageUrl(item.page)}>
                <motion.div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/30 text-white' 
                      : item.special
                        ? 'bg-gradient-to-r from-[#1e90ff]/10 to-purple-500/10 border border-[#1e90ff]/20 text-[#1e90ff] hover:border-[#1e90ff]/40'
                        : 'text-[#8ba3c7] hover:bg-[#1a2d4a]/50 hover:text-white'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#d4af37]' : item.special ? 'text-[#d4af37]' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                  {item.special && !isActive && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-auto text-xs"
                    >
                      ✨
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
          
          {user?.role === 'admin' && (
            <Link to={createPageUrl('AdminPanel')}>
              <motion.div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPageName === 'AdminPanel' 
                    ? 'bg-gradient-to-r from-[#1e90ff]/20 to-[#1e90ff]/5 border border-[#1e90ff]/30 text-white' 
                    : 'text-[#8ba3c7] hover:bg-[#1a2d4a]/50 hover:text-white'
                }`}
                whileHover={{ x: 4 }}
              >
                <Shield className={`w-5 h-5 ${currentPageName === 'AdminPanel' ? 'text-[#1e90ff]' : ''}`} />
                <span className="font-medium">Admin Panel</span>
              </motion.div>
            </Link>
          )}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#1a2d4a]">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1a2d4a]/30 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8962e] flex items-center justify-center">
              <User className="w-5 h-5 text-[#0a1628]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {profile?.pirate_name || user?.full_name || 'Pirate'}
              </p>
              <div className="flex items-center gap-1">
                <Coins className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[#d4af37] text-xs font-bold">
                  {profile?.total_points?.toLocaleString() || 0}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="text-[#5a7a9a] hover:text-white hover:bg-[#1a2d4a] h-8 w-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-[#0d1a2d]/95 backdrop-blur-xl border-b border-[#1a2d4a] z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-lg">
              <Skull className="w-5 h-5 text-[#0a1628]" />
            </div>
            <span className="text-lg font-black text-white">AdPiratin</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-[#1a2d4a] rounded-lg">
              <Coins className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#d4af37] text-sm font-bold">
                {profile?.total_points?.toLocaleString() || 0}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-14 bg-[#0d1a2d]/98 backdrop-blur-xl z-40"
          >
            <nav className="p-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link 
                    key={item.name} 
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`flex items-center gap-3 px-4 py-4 rounded-xl ${
                      isActive 
                        ? 'bg-[#d4af37]/10 border border-[#d4af37]/30' 
                        : 'hover:bg-[#1a2d4a]'
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-[#d4af37]' : 'text-[#8ba3c7]'}`} />
                      <span className={isActive ? 'text-white font-medium' : 'text-[#8ba3c7]'}>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
              
              {user?.role === 'admin' && (
                <Link to={createPageUrl('AdminPanel')} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-4 rounded-xl ${
                    currentPageName === 'AdminPanel' ? 'bg-[#1e90ff]/10 border border-[#1e90ff]/30' : 'hover:bg-[#1a2d4a]'
                  }`}>
                    <Shield className={`w-5 h-5 ${currentPageName === 'AdminPanel' ? 'text-[#1e90ff]' : 'text-[#8ba3c7]'}`} />
                    <span className={currentPageName === 'AdminPanel' ? 'text-white font-medium' : 'text-[#8ba3c7]'}>Admin Panel</span>
                  </div>
                </Link>
              )}

              <div className="pt-4 border-t border-[#1a2d4a] mt-4">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}