import { Maximize2, Send, Paperclip, Loader2 } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore } from "@/store/chat-store";

export function ChatDockBar() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useChatStore((s) => s.sendMessage);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const dockExpanded = useChatStore((s) => s.dockExpanded);
  const setDockExpanded = useChatStore((s) => s.setDockExpanded);
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);

  const canSend = input.trim().length > 0 && !isStreaming;

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

  if (dockExpanded) {
    return null;
  }

  return (
    <div className="border-t border-gray-800 bg-[#0d0d0d] font-mono z-20 shadow-2xl pb-4">
      {error && (
        <div className="flex items-center justify-between bg-red-900/20 px-3 py-1.5 text-xs text-red-400 border-b border-red-900/50">
          <span className="truncate">{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto flex items-end gap-3 px-4 pt-3 pb-1">
        {/* Left: expand toggle */}
        <div className="flex items-center gap-2 mb-1">
          <button
            type="button"
            onClick={() => setDockExpanded(true)}
            className="rounded p-2 text-gray-500 hover:bg-gray-800 hover:text-[#4FD1C5] transition-colors"
            title="Expandir Chat"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Input area */}
        <div className="flex-1 relative flex items-end bg-[#141414] border border-gray-800 rounded-lg overflow-hidden focus-within:border-[#4FD1C5] transition-colors">
          <button
            type="button"
            className="p-3 text-gray-500 hover:text-gray-300 transition-colors"
            title="Adjuntar archivo"
            onClick={() => {}}
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <TextareaAutosize
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setDockExpanded(true)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Asigna una tarea al Agente Lead..."
            maxRows={6}
            className="flex-1 resize-none bg-transparent py-3 pr-3 text-sm text-gray-200 outline-none placeholder:text-gray-600"
          />

          <div className="p-2">
            {isStreaming ? (
              <div className="rounded p-2 text-[#4FD1C5]">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className={`rounded p-2 transition-colors border ${
                  canSend
                    ? "bg-[#4FD1C5]/10 text-[#4FD1C5] border-[#4FD1C5]/30 hover:bg-[#4FD1C5]/20 hover:border-[#4FD1C5]/50"
                    : "bg-transparent text-gray-600 border-transparent"
                }`}
                title="Enviar tarea"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
