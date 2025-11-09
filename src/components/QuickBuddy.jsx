import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Bot } from "lucide-react"; 




const BASE_URL = "https://quickinvoice-backend-1.onrender.com"; //


export default function QuickBuddy() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user' | 'assistant', text }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextSummary, setContextSummary] = useState(null);
  const scroller = useRef();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  async function sendToBackend(message) {
    if (!token) {
      setMessages(prev => [...prev, { role: "assistant", text: "Please sign in to use Quick Buddy." }]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/quickbuddy/message`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        const reply = res.data.reply || "Sorry, no response.";
        setMessages(prev => [...prev, { role: "assistant", text: reply }]);
        if (res.data.context) setContextSummary(res.data.context);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: "Quick Buddy is currently unavailable." }]);
      }
    } catch (err) {
      console.error("QuickBuddy frontend error:", err?.response?.data || err.message);
      setMessages(prev => [...prev, { role: "assistant", text: "There was an error contacting Quick Buddy." }]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }
  // When opening first time, get greeting (backend will return a friendly summary)
  useEffect(() => {
    if (open && messages.length === 0) {
      // add a loader assistant message optionally
      setMessages([{ role: "assistant", text: "Connecting to Quick Buddy..." }]);
      sendToBackend(""); // empty triggers greeting + context
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  // Auto-scroll
  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight + 200;
    }
  }, [messages]);
  // const handleSend = async (e) => {
  //   e?.preventDefault();
  //   if (!input.trim()) return;
  //   setMessages(prev => [...prev, { role: "user", text: input.trim() }]);
  //   await sendToBackend(input.trim());
  // };

  const handleSend = async (e) => {
      e?.preventDefault();
      if (!input.trim()) return;
      const userMessage = input.trim();   // store before clearing
      setMessages(prev => [...prev, { role: "user", text: userMessage }]);
      setInput("");                       // ✅ clear input immediately
      setLoading(true);                   // ✅ trigger thinking/loading state
      await sendToBackend(userMessage);
      setLoading(false);                  // ✅ stop loading indicator once response comes back
    };
  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Quick Buddy"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0046A5] to-[#00B86B] shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
        >
          <Bot size={20} />
        </button>
      </div>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[95%] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#00B86B] to-[#0046A5] flex items-center justify-center text-white font-bold">
                Q
              </div>
              <div>
                <div className="text-sm font-semibold text-[#0046A5]">Quick Buddy</div>
                <div className="text-xs text-gray-500">Your professional assistant</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">{loading ? "Thinking..." : "Ready"}</div>
          </div>
          {/* messages */}
          <div ref={scroller} className="p-4 max-h-72 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`${m.role === "user" ? "bg-[#0046A5] text-white" : "bg-white text-gray-800 border"} px-3 py-2 rounded-lg max-w-[85%] shadow-sm`}>
                  <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
          </div>
          {/* optional small context summary */}
          {contextSummary && (
            <div className="px-4 py-2 bg-white border-t text-xs text-gray-600">
              <strong className="text-gray-800">Summary:</strong> {contextSummary.unpaidCount} unpaid • {contextSummary.paidCount} paid
            </div>
          )}
          {/* input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2 items-center">
            {/* <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Quick Buddy (e.g. Who owes me?)"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-md bg-[#0046A5] hover:bg-[#00398D] text-white disabled:opacity-60"
            >
              <Send size={16} />
            </button> */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Quick Buddy (e.g. Who owes me?)"
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0046A5]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-md bg-[#0046A5] hover:bg-[#00398D] text-white disabled:opacity-60 flex items-center justify-center w-9 h-9"
            >
              {loading ? (
                <span className="animate-pulse text-lg font-bold">...</span>
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}



