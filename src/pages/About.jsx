import React from 'react';
import { motion } from 'framer-motion';
import { Skull, Shield, Users, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f2137] to-[#0a1628] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About AdPiratin</h1>
          <p className="text-[#d4af37] text-lg font-medium">Fair winds, fair prices — fighting deceptive advertising since 2024</p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#1a2d4a]/60 backdrop-blur-xl border-[#2a4a6a]/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#d4af37]" />
                  What is AdPiratin?
                </h2>
                <p className="text-[#c4d4e4] leading-relaxed text-base">
                  AdPiratin is a community-powered platform designed to expose, report, and fight back against deceptive digital advertising across Europe. 
                  We help consumers identify misleading ads — from fake discounts and greenwashing to hidden fees and dark patterns — and report them to the relevant authorities under the EU Digital Services Act (DSA) 2025. 
                  Our gamified approach rewards vigilant users with Pirate Points for every violation they uncover, making consumer protection fun, engaging, and impactful. 
                  Using cutting-edge on-device AI scanning (privacy-first, zero data shared), users can analyze advertisements directly on their device without ever uploading their data to our servers.
                  AdPiratin also empowers pirate clans — groups of like-minded advocates — to organize raids, share intelligence, publish exposés, and build a community around fair digital commerce.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-[#1a2d4a]/60 backdrop-blur-xl border-[#2a4a6a]/50 h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#1e90ff]" />
                    Who is it for?
                  </h2>
                  <p className="text-[#c4d4e4] leading-relaxed text-base">
                    AdPiratin is built for everyday consumers across Germany, France, the Netherlands, Belgium, Austria, Spain, Italy, and Portugal who are tired of being misled by predatory advertising.
                    Whether you're a budget-conscious shopper, a digital rights advocate, a journalist, or simply someone who values honesty — you belong here.
                    Our growing fleet of pirates ranges from casual reporters to elite clan leaders who coordinate large-scale advertising audits.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-[#1a2d4a]/60 backdrop-blur-xl border-[#2a4a6a]/50 h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-[#d4af37]" />
                    Who builds it?
                  </h2>
                  <p className="text-[#c4d4e4] leading-relaxed text-base">
                    AdPiratin is built by a passionate team of developers, consumer advocates, and privacy researchers united by one mission: making digital advertising honest and transparent.
                    We are independent, ad-free, and community-funded. Our open development philosophy means that every feature is shaped by the pirates who use it.
                    We operate in alignment with EU consumer protection law and collaborate with civil society organizations to maximize impact.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-[#d4af37]/10 to-[#1e90ff]/10 backdrop-blur-xl border-[#d4af37]/20">
              <CardContent className="p-8 text-center">
                <Shield className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
                <p className="text-white font-bold text-lg">Privacy First, Always</p>
                <p className="text-[#8ba3c7] mt-2">All AI detection runs on your device. No personal data is ever shared with our servers.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}