"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const QUICK_PROMPTS = [
  "🇵🇰 ETEA PST میرٹ فارمولا",
  "📊 Excel VLOOKUP (Urdu/English)",
  "📄 Free ATS CV Kaise Banayein?",
  "📇 ETEA Roll No Slip Guide",
  "🎓 HMT Computer Course Details",
];

export default function AiTutorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Assalam o Alaikum! 👋 I am **HMT AI Assistant** (ایچ ایم ٹی اے آئی اسسٹنٹ).\n\nI speak **English, Roman Urdu, and Urdu Script (اردو)**!\n\nAsk me anything about ETEA KP exams, MS Office (Excel/Word), ATS CV building, or HMT courses!",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || loading) return;

    const userMessage = { sender: "user", text: query.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: query.trim(),
          messages: updatedMessages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      if (data?.reply) {
        setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Assalam o Alaikum! How can I help you with ETEA, Excel, or ATS CV building today?",
          },
        ]);
      }
    } catch (err) {
      console.warn("AI Tutor request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I encountered a temporary connection issue. Please try asking again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Chat cleared! How can I assist you now? (آپ اپنا سوال اردو میں بھی پوچھ سکتے ہیں)",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans print:hidden">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open HMT AI Tutor Chat"
          className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white font-black text-xs shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 border border-white/20"
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg animate-bounce">
            🤖
          </span>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] font-black text-amber-200 uppercase tracking-widest leading-none">
              URDU & ENGLISH AI TUTOR
            </span>
            <span className="block text-sm font-black text-white mt-0.5 leading-none">
              HMT AI Assistant
            </span>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-slate-950"></span>
          </span>
        </button>
      )}

      {/* EXPANDABLE CHAT MODAL WINDOW */}
      {isOpen && (
        <div className="w-[340px] sm:w-[420px] h-[520px] sm:h-[580px] rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* MODAL HEADER */}
          <div className="p-4 bg-gradient-to-r from-[#031530] via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 flex items-center justify-center shadow-lg">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>HMT AI Assistant</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    اردو & English
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">
                  Powered by HMT Success Academy & Gemini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Chat"
                className="px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                🧹 Clear
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 text-xs ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                    🤖
                  </div>
                )}

                <div
                  dir="auto"
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-tr-none shadow-md"
                      : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start items-center text-xs text-amber-300 font-bold">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                  🤖
                </div>
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-1.5">
                  <span className="animate-pulse">Thinking / سوچ رہا ہے...</span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-amber-300/90 border border-slate-800 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              dir="auto"
              placeholder="Ask in English, Roman Urdu, or اردو script..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition shadow-md shrink-0"
            >
              Send 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

