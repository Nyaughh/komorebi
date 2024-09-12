'use client'
import { ModeToggle } from '@/components/ThemeToggle';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Send, Star, Moon, Cloud, Download, Heart, ArrowRight, Settings, Check } from "lucide-react";
import { Pacifico } from 'next/font/google';
import { useTheme } from 'next-themes';
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  type?: 'text' | 'image';
};

const MessageBubble = ({ message, sender, type }: { message: string; sender: 'user' | 'bot'; type?: 'text' | 'image' }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="flex flex-col mb-4 w-full"
    >
      <div className={cn(
        "flex items-center mb-1",
        sender === 'user' ? 'flex-row-reverse' : 'flex-row'
      )}>
        <StarIcon />
        <span className={cn(
          "px-3 py-1 text-white rounded-full text-sm font-bold",
          sender === 'user' ? 'mr-2' : 'ml-2',
          sender === 'user' 
            ? 'bg-pink-300' 
            : theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
        )}>
          {sender === 'user' ? 'You' : 'Komorebi'}
        </span>
      </div>
      <div className={cn(
        "rounded-2xl p-3 shadow-md w-full",
        sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none',
        theme === 'dark' ? 'bg-gray-600' : 'bg-white'
      )}>
        {type === 'image' ? (
          <img src={message} alt="Generated content" className="w-full h-auto rounded-lg" />
        ) : (
          <p className={cn(
            theme === 'dark' ? 'text-gray-200' : 'text-purple-700'
          )}>{message}</p>
        )}
        <div className={cn(
          "flex items-center mt-1",
          sender === 'user' ? 'justify-start' : 'justify-end'
        )}>
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

interface PromptSelectorProps {
  onApplyPrompt: (prompt: string) => void;
  currentPrompt: string;
}

const PromptSelector = ({ onApplyPrompt, currentPrompt }: PromptSelectorProps) => {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [tempCustomPrompt, setTempCustomPrompt] = useState(currentPrompt)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTempCustomPrompt(currentPrompt)
  }, [currentPrompt])

  const handleCustomPromptDone = () => {
    onApplyPrompt(tempCustomPrompt)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 transition-all hover:text-pink-600 hover:scale-110 bg-transparent hover:bg-transparent">
          <Settings className="h-[1.5rem] w-[1.5rem]" />
          <span className="sr-only">Toggle settings</span>
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent align="end" asChild forceMount>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  ref={inputRef}
                  value={tempCustomPrompt}
                  onChange={(e) => setTempCustomPrompt(e.target.value)}
                  placeholder="Enter custom prompt..."
                  className="mt-2 transition-all focus:ring-2 focus:ring-pink-500"
                />
                <Button
                  onClick={handleCustomPromptDone}
                  className="mt-2 w-full bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Apply Prompt
                </Button>
              </motion.div>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  )
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [showSuggestion, setShowSuggestion] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Scroll to bottom on initial render
    scrollToBottom();
  }, []);

  const sendMessageToGroq = async (message: string) => {
    const response = await fetch('/api/groq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, messages: messages.slice(-5), customPrompt: currentPrompt }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from GROQ');
    }
    const data = await response.json();
    return data.response;
  };

  const generateImage = async (query: string) => {
    try {
      const response = await fetch('/api/huggingface', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        // Response is JSON
        const data = await response.json();
        if (!data.imageUrl) {
          console.error('Invalid response from Hugging Face API:', data);
          throw new Error('Invalid response from image generation API');
        }
        return data.imageUrl;
      } else {
        // Response is not JSON, likely an error message
        const text = await response.text();
        console.error('Error response from Hugging Face API:', text);
        throw new Error(`Failed to generate image: ${text}`);
      }
    } catch (error) {
      console.error('Error in generateImage:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { id: messages.length + 1, text: input, sender: "user" };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);
      setShowSuggestion(false);

      try {
        if (input.trim().toLowerCase().startsWith("/image")) {
          // Image generation request
          const imagePrompt = input.slice(6).trim();
          const imageUrl = await generateImage(imagePrompt);
          setIsTyping(false);
          setMessages(prev => [...prev, { id: prev.length + 1, text: imageUrl, sender: "bot", type: "image" }]);
        } else {
          // Regular text query
          const groqResponse = await sendMessageToGroq(input);
          setIsTyping(false);
          setMessages(prev => [...prev, { id: prev.length + 1, text: groqResponse, sender: "bot" }]);
        }
      } catch (error) {
        console.error("Error in handleSend:", error);
        setIsTyping(false);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        setMessages(prev => [...prev, { id: prev.length + 1, text: `Error: ${errorMessage}`, sender: "bot" }]);
      }
    }
  }

  const handleApplyPrompt = (newPrompt: string) => {
    setCurrentPrompt(newPrompt);
    // Here you can add any additional logic to apply the new prompt
    // For example, you might want to clear the chat history or send a message to the AI
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.endsWith('/')) {
      setShowSuggestion(true);
    } else {
      setShowSuggestion(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && showSuggestion) {
      e.preventDefault();
      setInput('/image ');
      setShowSuggestion(false);
    } else if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, []);

  const handleSuggestionClick = () => {
    setInput('/image ');
    setShowSuggestion(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (showSuggestion) {
      const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setShowSuggestion(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestion]);

  useEffect(() => {
    function setVH() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set VH immediately
    setVH();

    // Set it again after a short delay
    setTimeout(setVH, 0);

    // And again after a longer delay
    setTimeout(setVH, 100);

    // Set isLoaded to true after a short delay
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    // Add event listeners
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    document.addEventListener('touchmove', setVH);
    document.addEventListener('scroll', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
      document.removeEventListener('touchmove', setVH);
      document.removeEventListener('scroll', setVH);
      clearTimeout(loadTimer);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center w-full h-screen p-4 mobile-full-height ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      <div className={cn(
        "flex flex-col w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 relative h-full",
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-pink-200 border-white'
      )}>
        <div className="flex items-center justify-between px-3 py-2 text-pink-500">
          <ModeToggle />
          <h1 className={cn(
            pacifico.className,
            "text-4xl font-bold drop-shadow-lg text-center flex-grow",
            theme === 'dark' ? 'text-pink-300' : 'text-white'
          )} style={{ textShadow: theme === 'dark' ? "2px 2px 0px #4B0082" : "2px 2px 0px #FF69B4" }}>
            Komorebi
          </h1>
          <PromptSelector onApplyPrompt={handleApplyPrompt} currentPrompt={currentPrompt} />
        </div>
        
        <div 
          ref={chatContainerRef}
          className={cn("flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar", theme === 'dark' ? 'bg-gray-700' : 'bg-pink-100')}
        >
          {messages.length === 0 && (
            <p className="text-pink-400 text-base font-semibold font-mono opacity-70 text-center">
              Say hello to Komorebi!
            </p>
          )}
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message.text} sender={message.sender} type={message.type} />
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className={cn(
              "rounded-full p-2 shadow-md inline-block",
              theme === 'dark' ? 'bg-gray-600' : 'bg-white'
            )}>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className={cn(
          "p-3 bg-opacity-50 backdrop-blur-sm",
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        )}>
          <div className="flex items-center gap-2 relative">
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex-1 rounded-full border-2 placeholder-pink-300 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:border-pink-400 focus:outline-none text-sm",
                theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-pink-50 text-pink-800 border-pink-300'
              )}
            />
            <AnimatePresence>
              {showSuggestion && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "absolute left-0 bottom-full mb-2 px-3 py-1 rounded-md cursor-pointer text-sm shadow-sm",
                    theme === 'dark' ? 'bg-gray-600 text-pink-300' : 'bg-pink-100 text-pink-800'
                  )}
                  onClick={handleSuggestionClick}
                  style={{ width: `${inputWidth}px` }}
                >
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  >
                    /image
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              onClick={handleSend}
              className={cn(
                "rounded-full shadow-sm p-1.5 border-2 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:border-pink-400",
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-pink-300 border-gray-600' : 'bg-pink-50 hover:bg-pink-100 text-pink-800 border-pink-300'
              )}
              size="icon"
            >
              <ArrowRight className="h-3 w-3" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>

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
            width: 4px;
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

          .mobile-full-height {
            height: 100vh; /* Fallback for browsers that do not support Custom Properties */
            height: calc(var(--vh, 1vh) * 100);
          }

          /* Add this to ensure the body and html take full height */
          html, body, #__next {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          body {
            min-height: 100vh;
            min-height: -webkit-fill-available;
            overflow: hidden;
            position: fixed;
            width: 100%;
          }

          html {
            height: -webkit-fill-available;
          }
        `}</style>
      </div>
    </div>
  )
}