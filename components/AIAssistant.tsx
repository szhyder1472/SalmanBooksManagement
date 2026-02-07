
import React, { useState, useRef, useEffect } from 'react';
import { Send, BrainCircuit, Sparkles, User, Loader2, Globe, ExternalLink } from 'lucide-react';
import { getAIAssistanceStream } from '../services/geminiService';
import { Book, Sale, Purchase } from '../types';

interface AIAssistantProps {
  data: {
    books: Book[];
    sales: Sale[];
    purchases: Purchase[];
  };
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: { title: string; uri: string }[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm Salman AI, your store intelligence partner. I can help you analyze your stock, track profit trends, or look up details for any book you want to stock. How can I help Salman Book Center today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const stream = await getAIAssistanceStream(userMessage, data);
      
      let assistantText = '';
      let sources: { title: string; uri: string }[] = [];

      // Add a placeholder message for the assistant
      setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

      for await (const chunk of stream) {
        const textChunk = chunk.text || '';
        assistantText += textChunk;
        
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const newSources = groundingChunks
            .filter(c => c.web)
            .map(c => ({ title: c.web!.title, uri: c.web!.uri }));
          if (newSources.length > 0) {
            sources = [...sources, ...newSources];
          }
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'assistant') {
            lastMsg.text = assistantText;
            lastMsg.sources = sources.length > 0 ? sources : undefined;
          }
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I encountered an error. Please check your connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in zoom-in-95 duration-500">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold outfit tracking-tight">Salman Intelligence</h3>
              <p className="text-xs text-indigo-100 flex items-center gap-1 opacity-80">
                <Sparkles size={12} /> Powered by Gemini
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Ready</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-white text-indigo-600 border border-slate-200'
                }`}>
                  {m.role === 'user' ? <User size={20} /> : <BrainCircuit size={20} />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    {m.text || (m.role === 'assistant' && !isLoading ? "..." : "")}
                    {m.role === 'assistant' && !m.text && isLoading && (
                      <div className="flex gap-1 py-1">
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-150"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce delay-300"></div>
                      </div>
                    )}
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {m.sources.map((src, sidx) => (
                        <a 
                          key={sidx} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-semibold text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                        >
                          <Globe size={10} />
                          {src.title.length > 20 ? src.title.substring(0, 20) + '...' : src.title}
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2 max-w-3xl mx-auto w-full">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Salman's AI anything..."
                className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner text-sm transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <Sparkles size={18} />
              </div>
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
