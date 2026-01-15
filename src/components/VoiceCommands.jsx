import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VOICE_RESPONSES = {
  kill: ["Arrr, ad walked the plank!", "Silenced that scallywag!", "Sent to Davy Jones' locker!"],
  hunt: ["Treasure found, matey!", "Better deals ahead!", "X marks the savings spot!"],
  bust: ["Lies detected! Report filed!", "Shiver me timbers, that's fraud!", "Caught red-handed!"]
};

export default function VoiceCommands({ onCommand }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recog.onerror = () => {
        setListening(false);
        toast.error('Voice recognition failed. Try again!');
      };

      recog.onend = () => {
        setListening(false);
      };

      setRecognition(recog);
      setSupported(true);
    }
  }, []);

  const handleVoiceCommand = (transcript) => {
    let command = null;
    let response = null;

    if (transcript.includes('kill') || transcript.includes('hide')) {
      command = 'kill';
      response = VOICE_RESPONSES.kill[Math.floor(Math.random() * VOICE_RESPONSES.kill.length)];
    } else if (transcript.includes('hunt') || transcript.includes('find') || transcript.includes('alternative')) {
      command = 'hunt';
      response = VOICE_RESPONSES.hunt[Math.floor(Math.random() * VOICE_RESPONSES.hunt.length)];
    } else if (transcript.includes('bust') || transcript.includes('report')) {
      command = 'bust';
      response = VOICE_RESPONSES.bust[Math.floor(Math.random() * VOICE_RESPONSES.bust.length)];
    }

    if (command && response) {
      speakResponse(response);
      onCommand(command);
      toast.success(`Voice command: ${command}`);
    } else {
      toast.error('Command not recognized. Try "Kill it!", "Hunt!", or "Busted!"');
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
      toast.info('Listening... Say "Kill it!", "Hunt!", or "Busted!"');
    }
  };

  if (!supported) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      <Button
        onClick={toggleListening}
        className={`rounded-full w-14 h-14 ${
          listening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-gradient-to-r from-[#d4af37] to-[#b8962e] hover:opacity-90'
        }`}
        title="Voice Commands"
      >
        {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>
      
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#1a2d4a] border border-[#d4af37] rounded-xl px-4 py-2 whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />
              <span className="text-white text-sm font-medium">Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}