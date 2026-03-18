import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse, ChatMessage } from '../services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: input.trim() }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(input.trim(), messages);
      const modelMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: responseText || 'Sorry, I encountered an error.' }],
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: 'I am having trouble connecting right now. Please try again later.' }],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '500px',
              width: '380px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl border-2 border-pencil overflow-hidden mb-4 flex flex-col"
          >
            {/* Header */}
            <div className="bg-pencil text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-marker-red flex items-center justify-center font-bold text-xs">
                  DAA
                </div>
                <div>
                  <h3 className="font-heading text-sm leading-none">DAA Tutor AI</h3>
                  <p className="text-[10px] opacity-70">SRMIST 21CSC204J Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-1 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fdfdfb] scrollbar-thin scrollbar-thumb-pencil/20">
                  {messages.length === 0 && (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 bg-pencil/5 rounded-full flex items-center justify-center mx-auto">
                        <MessageCircle className="text-pencil/30" size={32} />
                      </div>
                      <p className="text-pencil/60 text-sm italic">
                        Ask me anything about DAA!<br/>
                        Recurrences, Sorting, DP, or Graphs...
                      </p>
                    </div>
                  )}
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "p-3 rounded-2xl text-sm",
                          msg.role === 'user'
                            ? "bg-pen-blue text-white rounded-tr-none"
                            : "bg-white border-2 border-pencil/10 text-pencil rounded-tl-none shadow-sm"
                        )}
                      >
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-pencil/5 prose-pre:text-pencil prose-code:text-marker-red">
                          <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                        </div>
                      </div>
                      <span className="text-[10px] mt-1 opacity-40 uppercase font-bold tracking-wider">
                        {msg.role === 'user' ? 'You' : 'Tutor'}
                      </span>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-pencil/40 italic text-xs">
                      <Loader2 size={14} className="animate-spin" />
                      Tutor is thinking...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-pencil/10 bg-white">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 bg-pencil/5 border-2 border-transparent focus:border-pencil rounded-xl px-4 py-2 text-sm outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="bg-pencil text-white p-2 rounded-xl hover:bg-pencil/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "w-14 h-14 rounded-full bg-pencil text-white shadow-2xl flex items-center justify-center transition-all",
          isOpen && "opacity-0 pointer-events-none scale-0"
        )}
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
};
