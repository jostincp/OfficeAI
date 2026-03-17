import { Minimize2, Send, Loader2 } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore } from "@/store/chat-store";
import ReactMarkdown from "react-markdown";

export function ChatDialog() {
  const dockExpanded = useChatStore((s) => s.dockExpanded);
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const setDockExpanded = useChatStore((s) => s.setDockExpanded);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const canSend = input.trim().length > 0 && !isStreaming;

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus
  useEffect(() => {
    if (dockExpanded && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [dockExpanded]);

  // Escape para cerrar
  useEffect(() => {
    if (!dockExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDockExpanded(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dockExpanded, setDockExpanded]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage(text);
    setInput("");
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend, isComposing],
  );

  if (!dockExpanded) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-t-xl border border-b-0 border-gray-700 bg-[#0d0d0d] shadow-2xl h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <span className="text-sm font-medium text-gray-300">Chat con el Equipo</span>
        <button
          type="button"
          onClick={() => setDockExpanded(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-300"
        >
          <Minimize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Escribe un mensaje para crear un proyecto...
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-[#4FD1C5] text-gray-900"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {msg.agentName && (
                  <div className="text-xs opacity-70 mb-1">{msg.agentName}</div>
                )}
                <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
        
        {isStreaming && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Procesando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between bg-red-900/20 px-4 py-2 text-xs text-red-400 border-t border-red-900/30">
          <span>{error}</span>
          <button onClick={clearError} className="hover:text-red-300">✕</button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-800 bg-[#141414] px-4 py-3">
        <div className="flex items-end gap-2">
          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Describe tu proyecto..."
            maxRows={4}
            className="flex-1 resize-none rounded-lg border border-gray-700 bg-[#0d0d0d] px-3 py-2 text-sm text-gray-200 outline-none placeholder:text-gray-600 focus:border-[#4FD1C5]"
          />
          {isStreaming ? (
            <div className="rounded-lg p-2 text-[#4FD1C5]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className={`rounded-lg p-2 transition-colors ${
                canSend
                  ? "bg-[#4FD1C5] text-gray-900 hover:bg-[#3DBDB0]"
                  : "bg-gray-800 text-gray-600"
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
