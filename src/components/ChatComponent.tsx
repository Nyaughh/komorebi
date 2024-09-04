'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Send, Star, Moon, Cloud, Download, Heart, ArrowRight } from "lucide-react"
import { Pacifico } from 'next/font/google'
import { useTheme } from 'next-themes'
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
})

const StarIcon = () => (
  <Star className="w-4 h-4 text-yellow-300" />
)

const MoonIcon = () => (
  <Moon className="w-4 h-4 text-yellow-300" />
)

const CloudIcon = () => (
  <Cloud className="w-5 h-5 text-white" />
)

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

const MessageBubble = ({ message, sender }: { message: string; sender: 'user' | 'bot' }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col mb-4"
    >
      <div className="flex items-center mb-1">
        <StarIcon />
        <span className={cn(
          "ml-2 px-3 py-1 text-white rounded-full text-sm font-bold",
          sender === 'user' 
            ? 'bg-pink-300' 
            : theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
        )}>
          {sender === 'user' ? 'You' : 'Komorebi'}
        </span>
      </div>
      <div className={cn(
        "rounded-2xl p-3 shadow-md",
        sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none',
        theme === 'dark' ? 'bg-gray-600' : 'bg-white'
      )}>
        <p className={theme === 'dark' ? 'text-gray-200' : 'text-purple-700'}>{message}</p>
        <div className="flex justify-end items-center mt-1">
          <MoonIcon />
          <CloudIcon />
        </div>
      </div>
    </motion.div>
  )
}

const TypingIndicator = () => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center space-x-2 mt-2">
      <motion.div
        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-pink-300' : 'bg-pink-300'}`}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut" }}
      />
      <motion.div
        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-pink-400' : 'bg-pink-400'}`}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut", delay: 0.25 }}
      />
      <motion.div
        className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-pink-500' : 'bg-pink-500'}`}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  )
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessageToGroq = async (message: string) => {
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, messages: messages.slice(-5) }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from GROQ');
    }
    const data = await response.json();
    return data.response;
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { id: messages.length + 1, text: input, sender: "user" };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      try {
        const groqResponse = await sendMessageToGroq(input);
        setIsTyping(false);
        setMessages(prev => [...prev, { id: prev.length + 1, text: groqResponse, sender: "bot" }]);
      } catch (error) {
        console.error("Error getting response from Komorebi:", error);
        setIsTyping(false);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setMessages(prev => [...prev, { id: prev.length + 1, text: `Error: ${errorMessage}`, sender: "bot" }]);
      }
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-[600px] max-w-md w-full min-w-[320px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4",
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-pink-200 border-white'
    )}>
      <div className="text-center mb-4 pt-4">
        <h1 className={`${pacifico.className} text-5xl font-bold drop-shadow-lg ${theme === 'dark' ? 'text-pink-300' : 'text-white'}`} style={{ textShadow: theme === 'dark' ? "3px 3px 0px #4B0082" : "3px 3px 0px #FF69B4" }}>
          Komorebi
        </h1>
      </div>
      
      <div className={cn("flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative", theme === 'dark' ? 'bg-gray-700' : 'bg-pink-100')}>
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <p className="text-pink-400 text-lg font-semibold font-mono opacity-70">
              Say hello to Komorebi!
            </p>
          </div>
        )}
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message.text} sender={message.sender} />
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex items-center">
            <div className={cn(
              "rounded-full p-2 shadow-md inline-block",
              theme === 'dark' ? 'bg-gray-600' : 'bg-white'
            )}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <motion.div 
        className={cn(
          "p-4 bg-opacity-50 backdrop-blur-sm",
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        )}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a cute message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className={cn(
              "flex-1 rounded-full border-2 placeholder-pink-300 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:border-pink-400 focus:outline-none",
              theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-pink-50 text-pink-800 border-pink-300'
            )}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSend}
              className={cn(
                "rounded-full shadow-sm p-2 border-2 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:border-pink-400",
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-pink-300 border-gray-600' : 'bg-pink-50 hover:bg-pink-100 text-pink-800 border-pink-300'
              )}
              size="icon"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        
        /* Remove default focus styles */
        *:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        /* Custom focus styles for input */
        input:focus {
          border-color: #f472b6 !important; /* pink-400 */
          box-shadow: 0 0 0 2px rgba(244, 114, 182, 0.5) !important; /* pink-400 with opacity */
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 182, 193, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 105, 180, 0.5);
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 105, 180, 0.8);
        }
      `}</style>
    </div>
  )
}