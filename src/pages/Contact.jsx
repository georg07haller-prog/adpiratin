import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skull, Mail, MessageSquare, Github, Send, Twitter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: 'contact@adpiratin.eu',
      subject: `Contact from ${form.name}: ${form.email}`,
      body: form.message,
    });
    setSending(false);
    toast.success('Message sent! We\'ll get back to you soon. ⚓');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-2xl">
              <Skull className="w-10 h-10 text-[#0a1628]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-[#8ba3c7] text-lg">Got a question, tip, or want to join the crew? Reach out below.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#1a2d4a]/60 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#1e90ff]" />
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-[#8ba3c7] mb-1 block">Name</Label>
                    <Input
                      placeholder="Your pirate name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-[#0a1628]/50 border-[#2a4a6a] text-white placeholder:text-[#5a7a9a]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#8ba3c7] mb-1 block">Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-[#0a1628]/50 border-[#2a4a6a] text-white placeholder:text-[#5a7a9a]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#8ba3c7] mb-1 block">Message</Label>
                    <Textarea
                      placeholder="What's on your mind?"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="bg-[#0a1628]/50 border-[#2a4a6a] text-white placeholder:text-[#5a7a9a] resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-[#0a1628] font-bold hover:opacity-90"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Direct Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="bg-[#1a2d4a]/60 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Direct Contact</h2>
                <div className="space-y-4">
                  <a href="mailto:contact@adpiratin.eu" className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1628]/40 hover:bg-[#0a1628]/70 transition-colors group">
                    <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                      <Mail className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-[#d4af37] transition-colors">Email</p>
                      <p className="text-[#8ba3c7] text-sm">contact@adpiratin.eu</p>
                    </div>
                  </a>
                  <a href="https://twitter.com/adpiratin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1628]/40 hover:bg-[#0a1628]/70 transition-colors group">
                    <div className="p-2 bg-[#1e90ff]/20 rounded-lg">
                      <Twitter className="w-5 h-5 text-[#1e90ff]" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-[#1e90ff] transition-colors">Twitter / X</p>
                      <p className="text-[#8ba3c7] text-sm">@adpiratin</p>
                    </div>
                  </a>
                  <a href="https://github.com/adpiratin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1628]/40 hover:bg-[#0a1628]/70 transition-colors group">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-white/80 transition-colors">GitHub</p>
                      <p className="text-[#8ba3c7] text-sm">github.com/adpiratin</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#d4af37]/10 to-[#1e90ff]/10 border-[#d4af37]/20">
              <CardContent className="p-6">
                <p className="text-[#d4af37] font-bold">Response Time</p>
                <p className="text-[#8ba3c7] text-sm mt-1">We typically respond within 48 hours. For urgent DSA reports, please use the Report Ad feature directly in the app.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}